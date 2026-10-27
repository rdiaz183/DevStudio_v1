import unreal
import os

def generate_material_from_textures(material_name, base_color_path, normal_path=None, roughness_path=None):
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    package_path = "/Game/Code510/Materials"
    
    # Ensure destination path exists
    unreal.EditorAssetLibrary.make_directory(package_path)
    
    # Create a new Material Instance or Material
    # For simplicity, we can load a Master Material template if it exists, or log setup
    unreal.log(f"[MaterialPiper] Generating material pipeline for: {material_name}")
    
    # Load textures if paths are provided
    bc_texture = unreal.EditorAssetLibrary.load_asset(base_color_path) if base_color_path else None
    
    if bc_texture:
        unreal.log(f"[MaterialPiper] Successfully loaded BaseColor texture: {base_color_path}")
        # Additional Unreal Material Editing Library calls can be chained here
    else:
        unreal.log_error(f"[MaterialPiper] Failed to load BaseColor texture at {base_color_path}")

if __name__ == "__main__":
    unreal.log("[MaterialPiper] Material piping module loaded.")