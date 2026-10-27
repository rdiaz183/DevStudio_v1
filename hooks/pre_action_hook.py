import json
from pathlib import Path

state_file = Path("Bridge/state_machine.json")

def validate_pre_action():
    if not state_file.exists():
        print("Error: Bridge/state_machine.json missing!")
        return False
        
    data = json.loads(state_file.read_text(encoding="utf-8"))
    sim_status = data.get("simulation_status", "")
    call_stack = data.get("call_stack", [])
    
    # Validate that the system state is ready for the next action
    if sim_status == "Committed":
        print(f"Pre-action validation PASSED: Simulation status is '{sim_status}' with {len(call_stack)} items in call stack.")
        return True
    else:
        print(f"Pre-action validation FAILED: Simulation status is '{sim_status}' (Required: 'Committed')")
        return False

if __name__ == "__main__":
    validate_pre_action()
