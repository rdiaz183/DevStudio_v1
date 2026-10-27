import os

os.makedirs("frontend", exist_ok=True)

html_code = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dev Studio - Game Dev Edition</title>
    <style>
        :root {
            --bg-color: #0b0f19;
            --card-bg: #131b2e;
            --accent: #38bdf8;
            --accent-glow: rgba(56, 189, 248, 0.2);
            --text: #f8fafc;
            --text-secondary: #94a3b8;
            --success: #22c55e;
            --border: #1e293b;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-color);
            color: var(--text);
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        h1 { margin: 0; color: var(--accent); font-size: 1.8rem; letter-spacing: 0.5px; }
        
        /* Navigation Tabs */
        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .tab-btn {
            background-color: var(--card-bg);
            color: var(--text-secondary);
            border: 1px solid var(--border);
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s ease;
        }
        .tab-btn.active {
            background-color: var(--accent);
            color: var(--bg-color);
            border-color: var(--accent);
            box-shadow: 0 0 15px var(--accent-glow);
        }

        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
        }
        .card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }
        .card h2 { margin-top: 0; font-size: 1.2rem; border-bottom: 1px solid var(--border); padding-bottom: 10px; color: var(--accent); }
        
        .stat-row {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            font-size: 0.95rem;
        }
        .stat-val { font-weight: bold; color: var(--accent); }

        label {
            display: block;
            margin-top: 12px;
            font-size: 0.85rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        textarea, input[type="text"], select {
            width: 100%;
            background: #090d16;
            border: 1px solid var(--border);
            color: var(--text);
            padding: 12px;
            border-radius: 8px;
            margin-top: 6px;
            box-sizing: border-box;
            font-family: inherit;
        }
        textarea { resize: vertical; height: 100px; }
        
        button.action-btn {
            background-color: var(--accent);
            color: var(--bg-color);
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 15px;
            width: 100%;
            transition: opacity 0.2s;
        }
        button.action-btn:hover { opacity: 0.9; }

        .output-box {
            background: #090d16;
            border: 1px solid var(--border);
            padding: 12px;
            border-radius: 8px;
            margin-top: 15px;
            min-height: 120px;
            max-height: 250px;
            overflow-y: auto;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.85rem;
            white-space: pre-wrap;
            color: #38bdf8;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Dev Studio <span style="font-size: 1rem; color: var(--text-secondary);">| Game Dev V1 Engine</span></h1>
            <span id="connection-status" style="color: var(--success); font-weight: bold;">● Core Online (D: Drive Active)</span>
        </header>

        <!-- Navigation Tabs -->
        <div class="tabs">
            <button class="tab-btn active" onclick="switchTab(event, 'gamedev-tab')">🎮 Game Dev Studio</button>
            <button class="tab-btn" onclick="switchTab(event, 'agents-tab')">🤖 Autonomous Agents</button>
            <button class="tab-btn" onclick="switchTab(event, 'telemetry-tab')">📊 Hardware & Telemetry</button>
        </div>

        <!-- TAB 1: Game Dev Studio (V1 Focus) -->
        <div id="gamedev-tab" class="tab-content active">
            <div class="grid">
                <div class="card">
                    <h2>Game Logic & Blueprint Assistant</h2>
                    <label for="gamedev-task">Target System / Feature:</label>
                    <input type="text" id="gamedev-task" value="Vehicle physics state machine & drift mechanics">
                    
                    <label for="engine-target">Engine Target:</label>
                    <select id="engine-target">
                        <option value="unreal">Unreal Engine 5 (C++ / Blueprints)</option>
                        <option value="unity">Unity (C#)</option>
                        <option value="custom">Custom C++ Engine / Workspace</option>
                    </select>

                    <button class="action-btn" onclick="generateGameScript()">Generate Architecture & Code</button>
                </div>

                <div class="card">
                    <h2>Generated Output & Blueprint Log</h2>
                    <div class="output-box" id="gamedev-output">Ready for game dev prompt synthesis...</div>
                </div>
            </div>
        </div>

        <!-- TAB 2: Autonomous Agents -->
        <div id="agents-tab" class="tab-content">
            <div class="grid">
                <div class="card">
                    <h2>Agent Execution Loop</h2>
                    <label for="agent-prompt">Agent Task / Objective:</label>
                    <textarea id="agent-prompt">Scan local workspace, verify state machine rules, and prepare build pipeline.</textarea>
                    <button class="action-btn" onclick="runAgentTask()">Execute Autonomous Loop</button>
                </div>
                <div class="card">
                    <h2>Thought & Execution Inspector</h2>
                    <div class="output-box" id="agent-output">Awaiting agent task...</div>
                </div>
            </div>
        </div>

        <!-- TAB 3: Hardware & Telemetry -->
        <div id="telemetry-tab" class="tab-content">
            <div class="grid">
                <div class="card">
                    <h2>Hardware Resource Monitor</h2>
                    <div class="stat-row"><span>CPU Usage:</span> <span id="cpu" class="stat-val">--</span></div>
                    <div class="stat-row"><span>RAM Usage:</span> <span id="ram" class="stat-val">--</span></div>
                    <div class="stat-row"><span>Dedicated VRAM Pool:</span> <span id="vram" class="stat-val">--</span></div>
                    <div class="stat-row"><span>Shared VRAM:</span> <span class="stat-val">8.0 GB</span></div>
                    <div class="stat-row"><span>Active Model:</span> <span id="model" class="stat-val">--</span></div>
                    <div class="stat-row"><span>External Storage (D:):</span> <span id="storage" class="stat-val">--</span></div>
                    <button class="action-btn" onclick="fetchTelemetry()">Refresh Telemetry</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function switchTab(evt, tabId) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            evt.currentTarget.classList.add('active');
        }

        async function fetchTelemetry() {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/telemetry');
                const data = await res.json();
                document.getElementById('cpu').innerText = data.cpu_usage_percent + '%';
                document.getElementById('ram').innerText = data.ram_usage_percent + '%';
                document.getElementById('vram').innerText = data.gpu_vram_dedicated_gb + ' GB / 6 GB';
                document.getElementById('model').innerText = data.active_model;
                document.getElementById('storage').innerText = data.external_storage_status;
            } catch (err) {
                document.getElementById('connection-status').style.color = '#ef4444';
                document.getElementById('connection-status').innerText = '● Core Offline';
            }
        }

        async function generateGameScript() {
            const task = document.getElementById('gamedev-task').value;
            const engine = document.getElementById('engine-target').value;
            const outputBox = document.getElementById('gamedev-output');
            outputBox.innerText = Synthesizing  architecture for: ""...;

            try {
                const res = await fetch('http://127.0.0.1:8000/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: [GameDev V1][]  })
                });
                const data = await res.json();
                outputBox.innerText = JSON.stringify(data, null, 2);
            } catch (err) {
                outputBox.innerText = "Error connecting to local backend engine: " + err;
            }
        }

        async function runAgentTask() {
            const prompt = document.getElementById('agent-prompt').value;
            const outputBox = document.getElementById('agent-output');
            outputBox.innerText = "Running autonomous agent loop...";

            try {
                const res = await fetch('http://127.0.0.1:8000/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt })
                });
                const data = await res.json();
                outputBox.innerText = JSON.stringify(data, null, 2);
            } catch (err) {
                outputBox.innerText = "Error executing agent task: " + err;
            }
        }

        fetchTelemetry();
        setInterval(fetchTelemetry, 5000);
    </script>
</body>
</html>
'''

with open("frontend/index.html", "w", encoding="utf-8") as f:
    f.write(html_code)

print("SUCCESS: frontend/index.html updated successfully!")
