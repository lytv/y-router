import { Env } from './env';
import { formatAnthropicToOpenAI } from './formatRequest';
import { streamOpenAIToAnthropic } from './streamResponse';
import { formatOpenAIToAnthropic } from './formatResponse';
import { indexHtml } from './indexHtml';
import { termsHtml } from './termsHtml';
import { privacyHtml } from './privacyHtml';
import { installSh } from './installSh';
import { settingsHtml } from './settingsHtml';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ============================================
    // Static Pages
    // ============================================

    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(indexHtml, {
        headers: { "Content-Type": "text/html" }
      });
    }

    if (url.pathname === '/settings' && request.method === 'GET') {
      return new Response(settingsHtml, {
        headers: { "Content-Type": "text/html" }
      });
    }

    if (url.pathname === '/terms' && request.method === 'GET') {
      return new Response(termsHtml, {
        headers: { "Content-Type": "text/html" }
      });
    }

    if (url.pathname === '/privacy' && request.method === 'GET') {
      return new Response(privacyHtml, {
        headers: { "Content-Type": "text/html" }
      });
    }

    if (url.pathname === '/install.sh' && request.method === 'GET') {
      return new Response(installSh, {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    // ============================================
    // Settings API
    // ============================================

    // GET /api/models - Fetch all available models from OpenRouter
    if (url.pathname === '/api/models' && request.method === 'GET') {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          return new Response(JSON.stringify({ error: 'Failed to fetch models from OpenRouter' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const data: any = await response.json();

        // Transform to simpler format
        const models = (data.data || []).map((model: any) => ({
          id: model.id,
          name: model.name || model.id,
          pricing: model.pricing ?
            `$${(parseFloat(model.pricing.prompt) * 1000000).toFixed(2)}/M in, $${(parseFloat(model.pricing.completion) * 1000000).toFixed(2)}/M out` :
            null,
          context_length: model.context_length
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));

        return new Response(JSON.stringify({ models }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // GET /api/config - Get current model mapping config
    if (url.pathname === '/api/config' && request.method === 'GET') {
      const config = {
        opus: env.MODEL_MAP_OPUS || '',
        sonnet: env.MODEL_MAP_SONNET || '',
        haiku: env.MODEL_MAP_HAIKU || ''
      };

      return new Response(JSON.stringify(config), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // POST /api/config - Save model mapping config
    if (url.pathname === '/api/config' && request.method === 'POST') {
      try {
        const body: any = await request.json();
        const { opus, sonnet, haiku } = body;

        // In Cloudflare Workers, we can't write to filesystem
        // For local development with wrangler, we need a different approach
        // We'll return the config that should be set

        // Note: This endpoint returns success and the config that should be applied
        // For local dev, the user needs to manually update .env or docker-compose.yml
        // For production, you'd use Cloudflare KV or D1 to persist config

        const envContent = `# OpenRouter Base URL
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Model Mapping Configuration
# Map Claude models to OpenRouter models
MODEL_MAP_OPUS=${opus || ''}
MODEL_MAP_SONNET=${sonnet || ''}
MODEL_MAP_HAIKU=${haiku || ''}
`;

        return new Response(JSON.stringify({
          success: true,
          message: 'Configuration prepared. Copy the following to your .env file:',
          envContent,
          config: { opus, sonnet, haiku }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // ============================================
    // Anthropic API Proxy
    // ============================================

    if (url.pathname === '/v1/messages' && request.method === 'POST') {
      const anthropicRequest = await request.json();

      // Build model mapping config from environment variables
      const modelMappingConfig = {
        opus: env.MODEL_MAP_OPUS,
        sonnet: env.MODEL_MAP_SONNET,
        haiku: env.MODEL_MAP_HAIKU,
      };

      const openaiRequest = formatAnthropicToOpenAI(anthropicRequest as any, modelMappingConfig);
      const bearerToken = request.headers.get("X-Api-Key") ||
        request.headers.get("Authorization")?.replace("Bearer ", "");
      const baseUrl = env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
      const openaiResponse = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(openaiRequest),
      });

      if (!openaiResponse.ok) {
        return new Response(await openaiResponse.text(), { status: openaiResponse.status });
      }

      if (openaiRequest.stream) {
        const anthropicStream = streamOpenAIToAnthropic(openaiResponse.body as ReadableStream, openaiRequest.model);
        return new Response(anthropicStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      } else {
        const openaiData = await openaiResponse.json();
        const anthropicResponse = formatOpenAIToAnthropic(openaiData, openaiRequest.model);
        return new Response(JSON.stringify(anthropicResponse), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
}