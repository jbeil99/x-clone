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
from huggingface_hub import InferenceClient
import os

# keep this in memory or session
chat_history = []

def get_chat_response(message):
    global chat_history  # or pass it in and return it out

    hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
    if not hf_api_key:
        return "Error: API key not found"

    try:
        client = InferenceClient(
            model="microsoft/DialoGPT-medium",
            token=hf_api_key
        )

        # Add current user message
        chat_history.append({"role": "user", "content": message})

        # Build the full prompt using chat history
        response = client.chat.completions.create(
            messages=[{"role": "system", "content": "You are a helpful assistant."}] + chat_history,
            temperature=0.7,
            max_tokens=200,
        )

        # Add assistant response to history
        reply = response.choices[0].message.content
        chat_history.append({"role": "assistant", "content": reply})

        # Optional: trim history to last 10 messages
        chat_history = chat_history[-10:]

        return reply

    except Exception as e:
        return f"Error: {str(e)}"
