# grok/utils.py
import os
import requests
from django.conf import settings



# def get_chat_response(message):
#     hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
#     if not hf_api_key:
#         return "Error: API key not found"

#     headers = {
#         "Authorization": f"Bearer {hf_api_key}",
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "inputs": f"[INST] {message} [/INST]",
#         "parameters": {
#             "max_new_tokens": 200,
#             "temperature": 0.7
#         }
#     }

#     response = requests.post(
#         "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
#         headers=headers,
#         json=payload
#     )

#     if response.status_code == 200:
#         return response.json()[0].get("generated_text", "No response generated.")
#     else:
#         return f"Error: {response.status_code} - {response.text}"

# grok/utils.py

def get_chat_response(message):
    hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
    if not hf_api_key:
        return "Error: API key not found"

    headers = {
        "Authorization": f"Bearer {hf_api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": f"{message}",
        "parameters": {
            "max_new_tokens": 200,
            "temperature": 0.7
        }
    }

    # ✅ Use Llama 2 instead of Mistral
    response = requests.post(
        "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf",
        headers=headers,
        json=payload
    )

    if response.status_code == 200:
        return response.json()[0].get("generated_text", "No response generated.")
    else:
        return f"Error: {response.status_code} - {response.text}"