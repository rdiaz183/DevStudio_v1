# backend/vault.py
import os
import json
from cryptography.fernet import Fernet

VAULT_FILE = "vault.enc"
KEY_FILE = "secret.key"

def get_or_create_key():
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, "rb") as key_file:
            return key_file.read()
    else:
        key = Fernet.generate_key()
        with open(KEY_FILE, "wb") as key_file:
            key_file.write(key)
        return key

ENCRYPTION_KEY = get_or_create_key()
cipher = Fernet(ENCRYPTION_KEY)

def save_secret(service_name: str, api_key: str):
    vault_data = {}
    if os.path.exists(VAULT_FILE):
        with open(VAULT_FILE, "rb") as f:
            decrypted_data = cipher.decrypt(f.read())
            vault_data = json.loads(decrypted_data.decode())
    
    vault_data[service_name] = api_key
    
    encrypted_data = cipher.encrypt(json.dumps(vault_data).encode())
    with open(VAULT_FILE, "wb") as f:
        f.write(encrypted_data)

def get_secret(service_name: str) -> str:
    if not os.path.exists(VAULT_FILE):
        return None
    with open(VAULT_FILE, "rb") as f:
        decrypted_data = cipher.decrypt(f.read())
        vault_data = json.loads(decrypted_data.decode())
        return vault_data.get(service_name)
