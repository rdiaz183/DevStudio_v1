import json
import datetime
from pathlib import Path

state_file = Path("Bridge/state_machine.json")

def update_state(action_name, agent_name):
    if state_file.exists():
        data = json.loads(state_file.read_text(encoding="utf-8"))
        data["timestamp"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data["last_simulated_action"] = f"{agent_name}:{action_name}"
        data["simulation_status"] = "Committed"
        
        state_file.write_text(json.dumps(data, indent=4), encoding="utf-8")
        print(f"State machine updated successfully -> {agent_name}:{action_name}")
    else:
        print("Error: Bridge/state_machine.json not found!")

if __name__ == "__main__":
    update_state("Routine_System_Audit", "Localization_And_Documentation_Lead")
