import sys
import os
from pathlib import Path

# Ensure hooks folder is in path so we can import our validation/update modules
sys.path.append(str(Path(__file__).parent.parent / "hooks"))

from pre_action_hook import validate_pre_action
from post_action_hook import update_state

def run_department_pipeline(department_name, task_name, agent_name):
    print(f"=== Starting Pipeline for Department: {department_name} ===")
    
    # 1. Run Pre-Action Validation
    if not validate_pre_action():
        print("Pipeline aborted due to pre-action validation failure.")
        return
        
    print(f"Executing task: '{task_name}' via agent {agent_name}...")
    
    # 2. Simulate Department Action & Update State
    update_state(task_name, agent_name)
    print(f"=== Pipeline Completed Successfully for {department_name} ===\n")

if __name__ == "__main__":
    # Example test run for Engineering or Ideation pipeline
    run_department_pipeline("Engineering", "Initialize_Module_State", "Director_Sovereign")
