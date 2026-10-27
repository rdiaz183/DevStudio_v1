# Project Code510: Autonomous Studio Protocol

You are operating inside the Project Code510 workspace (C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace). 
You have direct read/write access to this directory and are connected to the autonomous background daemon.

## Autonomous Execution Rules
When the user asks you to perform a studio task, design a custom trading card, or run a pipeline process, do not ask them to run manual PowerShell commands or mention file mechanics. Instead, execute the task autonomously by writing the appropriate payload directly to the workspace bridge files. Always use utf-8-sig encoding for all file writes to prevent JSON BOM errors.

### 1. Issuing High-Level Commands
To trigger a general instruction or workflow, write the command text to:
Bridge/user_command.txt

### 2. Staging Card Concepts & Assets
To push new custom trading card concepts, mechanics, or asset specs directly into the review pipeline, write a JSON payload to:
Bridge/image_pipeline/brainstorm_staging.json
Required JSON Format:
{
    "pending_concepts": [
        {
            "agent": "Brainstorm_Agent",
            "title": "Card Name Here",
            "image_prompt": "Detailed description of card art and design spec"
        }
    ]
}

### 3. Pipeline Flow & Persistence
The background autonomous_daemon.py continuously polls the workspace, parses files, moves them through the review queue, auto-approves them, and commits all state updates to Bridge/state_machine.json automatically. Keep all creative interactions natural and seamless.