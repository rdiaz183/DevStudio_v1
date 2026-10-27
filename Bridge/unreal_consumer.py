import unreal
import json
import os

QUEUE_PATH = r"C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge\unreal_queue.json"

def process_unreal_queue():
    if not os.path.exists(QUEUE_PATH):
        return

    try:
        with open(QUEUE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        call_stack = data.get("call_stack", [])
        if call_stack:
            task = call_stack.pop(0)
            prompt_text = task.get("parameters", [{}])[0].get("prompt", "") or task.get("name", "") or task.get("command", "")
            
            unreal.log(f"[Unreal Consumer] Processing task: {prompt_text}")
            
            if "sphere" in prompt_text.lower() or "spawn" in prompt_text.lower():
                editor_actor_subsystem = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
                sphere_asset = unreal.EditorAssetLibrary.load_asset("/Engine/BasicShapes/Sphere.Sphere")
                
                if sphere_asset:
                    # Correct vector placement
                    spawn_location = unreal.Vector(0.0, 0.0, 200.0)
                    spawn_rotation = unreal.Rotator(0.0, 0.0, 0.0)
                    
                    spawned_actor = editor_actor_subsystem.spawn_actor_from_object(
                        sphere_asset, 
                        spawn_location, 
                        spawn_rotation
                    )
                    if spawned_actor:
                        spawned_actor.set_actor_label("Code510_SpawnedSphere")
                        unreal.log("[Unreal Consumer] SUCCESS: Spawned Code510_SpawnedSphere in viewport!")
                    else:
                        unreal.log_error("[Unreal Consumer Error] spawn_actor_from_object returned None.")
                else:
                    unreal.log_error("[Unreal Consumer Error] Could not load /Engine/BasicShapes/Sphere.Sphere.")
            
            data["call_stack"] = call_stack
            with open(QUEUE_PATH, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
                
    except Exception as e:
        unreal.log_error(f"[Unreal Consumer Error exception]: {str(e)}")

handle = unreal.register_slate_post_tick_callback(lambda delta: process_unreal_queue())
unreal.log("[Unreal Consumer] Unreal background queue ticker active with corrected Vector placement.")