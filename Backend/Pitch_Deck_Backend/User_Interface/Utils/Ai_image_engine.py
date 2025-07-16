import os
import base64
import requests
from io import BytesIO

# ===================================== API KEYS ============================================
STABILITY_API_KEY = "sk-QSXhlJyLivQO51RKqwpkb3EiDRZCRIloGdjrjcX2MCpUhqbG"
HUGGING_FACE_API_KEY = "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"

# ===================================== IMAGE MODELS ========================================
IMAGE_MODELS = [
    {
        "name": "FLUX Schnell (Together)",
        "model": "black-forest-labs/FLUX.1-schnell",
        "priority": 1,
    }
]

# ================================ Stability Image Generation ================================
def generate_image_stability(prompt, width=512, height=512):
    url = "https://api.stability.ai/v2beta/stable-image/generate/core"
    headers = {
        "Authorization": f"Bearer {STABILITY_API_KEY}",
        "Accept": "image/*",
    }
    files = {
        'prompt': (None, prompt),
        'mode': (None, 'text-to-image'),
        'output_format': (None, 'png'),
        'width': (None, str(width)),
        'height': (None, str(height)),
    }

    try:
        response = requests.post(url, headers=headers, files=files)

        if response.status_code == 200:
            image_data = BytesIO(response.content)
            print("✅ Stability image generated (in memory)")
            return image_data
        else:
            print(f"❌ Stability API failed: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Stability error: {e}")
        return None


# ====================================== Hugging Face Image Generation ===================================
def generate_image_huggingface(prompt, model_name=None, width=432, height=768):
    for model in IMAGE_MODELS:
        if model_name and model["model"] != model_name:
            continue

        try:
            print(f"🔄 Generating with {model['name']}...")

            headers = {
                "Authorization": f"Bearer {HUGGING_FACE_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "prompt": prompt,
                "response_format": "base64",
                "model": model["model"],
                "height": height,
                "width": width
            }

            response = requests.post(
                "https://router.huggingface.co/together/v1/images/generations",
                headers=headers,
                json=payload
            )

            if not response.ok:
                raise Exception(f"HTTP {response.status_code}: {response.text}")

            result = response.json()
            base64_data = result.get("data", [{}])[0].get("b64_json")

            if not base64_data:
                raise Exception("Image data not found in response")

            image_bytes = base64.b64decode(base64_data)
            print("✅ Hugging Face image generated (in memory)")
            return BytesIO(image_bytes)

        except Exception as e:
            print(f"❌ Hugging Face error: {e}")
            return None



# from image_generation import generate_image_stability, generate_image_huggingface
# from PIL import Image

# prompt = "a majestic mountain under a night sky"

# # Stability
# img_bytes = generate_image_stability(prompt)
# if img_bytes:
#     img = Image.open(img_bytes)
#     img.show()

# # Hugging Face
# img_bytes_hf = generate_image_huggingface(prompt)
# if img_bytes_hf:
#     img = Image.open(img_bytes_hf)
#     img.show()
