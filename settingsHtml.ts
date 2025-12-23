export const settingsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y-Router Settings</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            color: #e0e0e0;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 2.5em;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #888;
            font-size: 1.1em;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }
        
        .card h2 {
            font-size: 1.3em;
            margin-bottom: 20px;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .card h2 .icon {
            font-size: 1.2em;
        }
        
        .model-group {
            margin-bottom: 25px;
        }
        
        .model-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #b0b0b0;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .model-group .description {
            font-size: 0.85em;
            color: #666;
            margin-bottom: 10px;
        }
        
        .select-wrapper {
            position: relative;
        }
        
        .model-select {
            width: 100%;
            padding: 14px 16px;
            font-size: 1em;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.3);
            color: #fff;
            cursor: pointer;
            transition: all 0.3s ease;
            appearance: none;
        }
        
        .model-select:hover {
            border-color: rgba(102, 126, 234, 0.5);
        }
        
        .model-select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        
        .model-select option {
            background: #1a1a2e;
            color: #fff;
            padding: 10px;
        }
        
        .select-arrow {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #666;
        }
        
        .current-value {
            font-size: 0.85em;
            color: #667eea;
            margin-top: 8px;
            font-family: monospace;
            background: rgba(102, 126, 234, 0.1);
            padding: 6px 10px;
            border-radius: 6px;
            display: inline-block;
        }
        
        .btn-group {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .btn {
            flex: 1;
            padding: 16px 24px;
            font-size: 1em;
            font-weight: 600;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #e0e0e0;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 10px;
            display: none;
        }
        
        .status.success {
            display: block;
            background: rgba(39, 174, 96, 0.2);
            border: 1px solid rgba(39, 174, 96, 0.3);
            color: #2ecc71;
        }
        
        .status.error {
            display: block;
            background: rgba(231, 76, 60, 0.2);
            border: 1px solid rgba(231, 76, 60, 0.3);
            color: #e74c3c;
        }
        
        .status.loading {
            display: block;
            background: rgba(52, 152, 219, 0.2);
            border: 1px solid rgba(52, 152, 219, 0.3);
            color: #3498db;
        }
        
        .back-link {
            position: fixed;
            top: 20px;
            left: 20px;
            color: #667eea;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.95em;
            transition: opacity 0.2s;
        }
        
        .back-link:hover {
            opacity: 0.8;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .search-input {
            width: 100%;
            padding: 12px 16px;
            font-size: 0.95em;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.3);
            color: #fff;
            margin-bottom: 10px;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .search-input::placeholder {
            color: #666;
        }
    </style>
</head>
<body>
    <a href="/" class="back-link">← Back to Home</a>
    
    <div class="container">
        <div class="header">
            <h1>⚙️ Model Mapping Settings</h1>
            <p>Configure which OpenRouter models to use for each Claude model type</p>
        </div>
        
        <div class="card">
            <h2><span class="icon">🔄</span> Model Mappings</h2>
            
            <div class="model-group">
                <label>Claude Opus 4.5</label>
                <p class="description">Used for complex tasks requiring deep analysis and reasoning</p>
                <input type="text" class="search-input" id="opus-search" placeholder="Search models..." oninput="filterModels('opus')">
                <div class="select-wrapper">
                    <select id="opus-model" class="model-select">
                        <option value="">Loading models...</option>
                    </select>
                    <span class="select-arrow">▼</span>
                </div>
                <div class="current-value" id="opus-current"></div>
            </div>
            
            <div class="model-group">
                <label>Claude Sonnet 4.5</label>
                <p class="description">Balanced model for everyday coding tasks</p>
                <input type="text" class="search-input" id="sonnet-search" placeholder="Search models..." oninput="filterModels('sonnet')">
                <div class="select-wrapper">
                    <select id="sonnet-model" class="model-select">
                        <option value="">Loading models...</option>
                    </select>
                    <span class="select-arrow">▼</span>
                </div>
                <div class="current-value" id="sonnet-current"></div>
            </div>
            
            <div class="model-group">
                <label>Claude Haiku 4.5</label>
                <p class="description">Fast model for quick tasks like commit messages, titles</p>
                <input type="text" class="search-input" id="haiku-search" placeholder="Search models..." oninput="filterModels('haiku')">
                <div class="select-wrapper">
                    <select id="haiku-model" class="model-select">
                        <option value="">Loading models...</option>
                    </select>
                    <span class="select-arrow">▼</span>
                </div>
                <div class="current-value" id="haiku-current"></div>
            </div>
            
            <div class="btn-group">
                <button class="btn btn-secondary" onclick="loadConfig()">
                    🔄 Reset to Current
                </button>
                <button class="btn btn-primary" id="save-btn" onclick="saveConfig()">
                    💾 Save & Restart
                </button>
            </div>
            
            <div class="status" id="status"></div>
        </div>
    </div>
    
    <script>
        let allModels = [];
        let currentConfig = {};
        
        // Load models from OpenRouter
        async function loadModels() {
            try {
                const response = await fetch('/api/models');
                const data = await response.json();
                allModels = data.models || [];
                
                // Populate all selects
                populateSelect('opus-model', allModels);
                populateSelect('sonnet-model', allModels);
                populateSelect('haiku-model', allModels);
                
                // Load current config after models are loaded
                await loadConfig();
            } catch (error) {
                showStatus('Failed to load models: ' + error.message, 'error');
            }
        }
        
        function populateSelect(selectId, models) {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">-- Select a model --</option>';
            
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.name + (model.pricing ? ' (' + model.pricing + ')' : '');
                select.appendChild(option);
            });
        }
        
        function filterModels(type) {
            const searchInput = document.getElementById(type + '-search');
            const select = document.getElementById(type + '-model');
            const searchTerm = searchInput.value.toLowerCase();
            
            const currentValue = select.value;
            
            const filteredModels = allModels.filter(model => 
                model.name.toLowerCase().includes(searchTerm) ||
                model.id.toLowerCase().includes(searchTerm)
            );
            
            populateSelect(type + '-model', filteredModels);
            
            // Restore selected value if it's in filtered list
            if (filteredModels.some(m => m.id === currentValue)) {
                select.value = currentValue;
            }
        }
        
        // Config server base URL (runs on port 8788 for file operations)
        const CONFIG_SERVER = 'http://localhost:8788';
        
        // Load current config from both sources - prefer config server
        async function loadConfig() {
            try {
                // Try config server first (can read from .env file)
                let config;
                try {
                    const response = await fetch(CONFIG_SERVER + '/config');
                    config = await response.json();
                } catch (e) {
                    // Fallback to wrangler env vars
                    const response = await fetch('/api/config');
                    config = await response.json();
                }
                
                currentConfig = config;
                
                document.getElementById('opus-model').value = config.opus || '';
                document.getElementById('sonnet-model').value = config.sonnet || '';
                document.getElementById('haiku-model').value = config.haiku || '';
                
                // Update current value display
                document.getElementById('opus-current').textContent = 'Current: ' + (config.opus || 'default');
                document.getElementById('sonnet-current').textContent = 'Current: ' + (config.sonnet || 'default');
                document.getElementById('haiku-current').textContent = 'Current: ' + (config.haiku || 'default');
            } catch (error) {
                showStatus('Failed to load config: ' + error.message, 'error');
            }
        }
        
        // Save config via config server
        async function saveConfig() {
            const btn = document.getElementById('save-btn');
            btn.disabled = true;
            btn.innerHTML = '<span class="loading-spinner"></span> Saving...';
            
            showStatus('Saving configuration...', 'loading');
            
            const config = {
                opus: document.getElementById('opus-model').value,
                sonnet: document.getElementById('sonnet-model').value,
                haiku: document.getElementById('haiku-model').value
            };
            
            try {
                const response = await fetch(CONFIG_SERVER + '/config', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(config)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showStatus('✅ ' + (result.message || 'Configuration saved! Server restarting...'), 'success');
                    
                    // Update current values
                    document.getElementById('opus-current').textContent = 'Current: ' + (config.opus || 'default');
                    document.getElementById('sonnet-current').textContent = 'Current: ' + (config.sonnet || 'default');
                    document.getElementById('haiku-current').textContent = 'Current: ' + (config.haiku || 'default');
                    
                    // Wait for restart then reload
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                } else {
                    showStatus('Failed to save: ' + (result.error || 'Unknown error'), 'error');
                }
            } catch (error) {
                // If config server is not running, show manual instructions
                showStatus('Config server not running. Please start it with: npx ts-node config-server.ts', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '💾 Save & Restart';
            }
        }
        
        function showStatus(message, type) {
            const status = document.getElementById('status');
            status.className = 'status ' + type;
            status.textContent = message;
        }
        
        // Initialize
        loadModels();
    </script>
</body>
</html>`;
