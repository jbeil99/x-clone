import google.generativeai as genai
from django.conf import settings

# Configure Gemini API with your API key
genai.configure(api_key=settings.GEMINI_API_KEY)


def generate_response(prompt):
    """Generates a response using the Gemini 1.5 Flash model."""
    model_name = "gemini-1.5-flash"
    model = genai.GenerativeModel(model_name)
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating response: {e}"


# You can optionally keep the list_available_models function for exploration
def list_available_models():
    """Lists the available Generative Models."""
    for m in genai.list_models():
        print(f"{m.name}: {m.description}")
        for method in m.supported_generation_methods:
            print(f"  - Supports: {method}")


if __name__ == "__main__":
    # You can run this directly to see the available models
    list_available_models()
