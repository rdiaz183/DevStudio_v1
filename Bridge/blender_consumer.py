import bpy
import json
import os

QUEUE_PATH = r"C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge\blender_queue.json"
POLL_INTERVAL = 2.0  # seconds

def process_queue():
    if not os.path.exists(QUEUE_PATH):
        return POLL_INTERVAL

    try:
        with open(QUEUE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        call_stack = data.get("call_stack", [])
        if call_stack:
            task = call_stack.pop(0)
            prompt_text = task.get("parameters", [{}])[0].get("prompt", "") or task.get("name", "")
            
            print(f"[Blender Consumer] Processing task: {prompt_text}")
            
            if "crate" in prompt_text.lower():
                window = bpy.context.window_manager.windows[0]
                screen = window.screen
                area = next((a for a in screen.areas if a.type == 'VIEW_3D'), None)
                
                if area:
                    region = next((r for r in area.regions if r.type == 'WINDOW'), None)
                    with bpy.context.temp_override(window=window, screen=screen, area=area, region=region):
                        if bpy.context.active_object and bpy.context.active_object.mode != 'OBJECT':
                            bpy.ops.object.mode_set(mode='OBJECT')
                            
                        # 1. Spawn base mesh for sci-fi crate
                        bpy.ops.mesh.primitive_cube_add(size=2.0, location=(0, 0, 1))
                        obj = bpy.context.active_object
                        if obj:
                            obj.name = "SciFi_Crate"
                            obj.scale = (1.4, 1.0, 0.8) # Distinct proportions
                            
                            # 2. Add heavy bevel modifier for hard-surface sci-fi edges
                            mod = obj.modifiers.new(name="SciFi_Bevel", type='BEVEL')
                            mod.width = 0.08
                            mod.segments = 3
                            
                            # 3. Create and assign a dark metallic PBR material
                            mat = bpy.data.materials.new(name="SciFi_Metal_Mat")
                            mat.use_nodes = True
                            bsdf = mat.node_tree.nodes.get("Principled BSDF")
                            if bsdf:
                                bsdf.inputs['Base Color'].default_value = (0.12, 0.12, 0.15, 1.0) # Dark gunmetal
                                bsdf.inputs['Metallic'].default_value = 0.90
                                bsdf.inputs['Roughness'].default_value = 0.30
                                
                            obj.data.materials.append(mat)
                            
                            # 4. Force Viewport Shading into Material Preview so PBR colors appear physically
                            for space in area.spaces:
                                if space.type == 'VIEW_3D':
                                    space.shading.type = 'MATERIAL'
                            
                            print("[Blender Consumer] Successfully generated and shaded SciFi_Crate in viewport!")
                            
                            bpy.ops.view3d.view_selected(use_all_regions=False)
                            bpy.ops.wm.redraw_timer(type='DRAW_WIN_SWAP', iterations=1)
                else:
                    print("[Blender Consumer Error] No VIEW_3D area found for context override.")
            
            data["call_stack"] = call_stack
            with open(QUEUE_PATH, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
                
    except Exception as e:
        print(f"[Blender Consumer Error] {e}")
        
    return POLL_INTERVAL

if not bpy.app.timers.is_registered(process_queue):
    bpy.app.timers.register(process_queue)
    print("[Blender Consumer] Background queue poller registered with forced material shading.")
