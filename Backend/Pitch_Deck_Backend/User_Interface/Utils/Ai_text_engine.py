import google.generativeai as genai
from openai import OpenAI
import anthropic
from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Set API keys
# # openai.api_key = os.getenv("OPENAI_API_KEY")
# genai.configure(api_key=os.getenv('GEMINI_API_KEY'))


GOOGLE_API_KEY = "AIzaSyDJv3Huew_CxqAyZ7YkCHpboyEl78Qb_DU" 
genai.configure(api_key=GOOGLE_API_KEY) # configuration of the api key 

text_model = genai.GenerativeModel('gemini-2.0-flash') # model name 

def genrate_gemni(topic_details,slide_pages,style,level):
    try:
        prompt = f"""
        Generate a comprehensive PowerPoint presentation on the topic: "{topic_details}", containing exactly {slide_pages} slides,content sonunds like a "{style}" and ,content words is in "{level}" manner.

        Each slide must include :
        1. **Presentation Topic**  
            - presentation sub topic 
            - Provide the topic title and only 0th page consist this.
        2. **Title**: A clear, engaging title for the slide.
        3. **Content**: Choose one of the following content types (based on relevance to the slide's purpose):
        - **Bullets** (title : descriptions  4 - 6 max)
            - insert bullets into shapes 
            - bullets_shapes_inches according to bullet text and looks good in whole slide
        - **Paragraph** (for deep explanations or contextual background)
        - **Analytics** (for presenting statistics, metrics, or comparisons)
        - **Numbered list** (for steps or processes)
                - insert numbered list into seprate shapes 
                - shapes inches according to text and slide spaces
                - seprate shapes for seprate numbered text 
                - numbered_shapes_inches
                - rgb value for shapes (e.g. , (0,0,0))

        4. **Image Prompt** (if relevant):
        - Include a descriptive prompt for an image that would visually complement the slide content.
        - Do this for roughly 40% of the slides (e.g., 4 out of 10). Leave the image prompt field empty for others.

        5. **Slide Classification**:
        - `"slideType"`: One of `"title"`, `"content"`, or `"conclusion"` based on the purpose of the slide.
        - `"layout"`: One of `"text-only"`, `"text-image"`, `"image-text"`, `"analytics-chart"` — choose appropriately for each slide.

        6. **Layout Coordinates for Accurate Rendering**:
        Provide exact `Inches` data (positioning and size for 13.33” x 7.5” slide canvas) for the following elements:
        - `"presentation_topic_inches" :  `[left, top, width, height],
        - `"title_Inches"`: `[left, top, width, height]` — positioning of the slide title.
        - `"Images_Inches"`: `[left=0, top=0, width=between 3.3 to 4.0, height=7.5(no change)]` — if an image prompt is provided.
        - `"paragraph_inches" `: [left, top, width, height],
        - `"bullets_shapes_inches" `: [left, top, width, height],
        - `"analytics_inches" `: [left, top, width, height],
        - `"numbered_shapes_inches" `: [left, top, width, height], 
        - `"": 

        7. **presentation_topic_color_value** : give color value which loooks attractive in pink gradinet slide 
        8. **title_color_value** : give color value which loooks attractive in pink gradinet slide little darker than teext color value
        9. **text_color_value** : give color value which loooks attractive in pink gradinet slide 
        10. **Return Format**:
        Respond with a JSON array of slides using the following structure:

        [
        {{
            "presentation_topic": "only in 1st slide"
            "presentation_subtopic" "only for first slide" 
            "presentation_topic_font_size": "size"
            "text_font_value" : "size"
            "presentation_topic_color_value" : "value"
            "all_text_color_": "colorvalue"
            "title": "Slide Title",
            "title_font_value": "size"
            "title_color_value": "colorvalue"
            "contentType": "bullets|numbered|paragraph|analytics",
            "content": {{
            "bullets": ["Bullet point 1", "Bullet point 2"],
            "numbered": ["Step 1: ...", "Step 2: ..."],
            "numbered_colors" :"colorvalue"
            "paragraph": "Full paragraph explaining the topic...",
            "analytics": [
                {{
                "label": "Metric",
                "value": "Value",
                "trend": "up|down|stable"
                }}
            ]
            }},
            "imagePrompt": "Description for relevant image (or empty string)",
            "slideType": "title|content|conclusion",
            "layout": "text-only|text-image|image-text|analytics-chart",
            "Inches": {{
            "Images_Inches": [left, top, width, height]
            "presentation_topic_inches" [left, top, width, height],
            "presentation_subtopic" [left, top, width, height], 
            "title_Inches": [left, top, width, height],
            "paragraph_Inches": [left, top, width, height],
            "bullets_shapes_inches" : [left, top, width, height],
            "analytics_inches": [left, top, width, height],
            "numbered_shapes_inches": [left, top, width, height],

            }}
        }},
        ...
        ]

        **Guidelines**:
        - 1st page only contains presentation topic with its font size and text colors + imagePrompt and its inches and others apart form this return a empty string for all 
        - Keep content engaging, easy to understand, and visually balanced.
        - Vary the content types across slides (dont repeat the same structure throughout).
        - For analytics slides, use metrics that are meaningful and up-to-date.
        - For step-by-step processes, prefer numbered lists.
        - For conceptual or overview slides, use bullet points.
        - For introductions, conclusions, and background context, use paragraphs.
        - Ensure image prompts (where used) are detailed and strongly related to the slide content.
        - All inch measurements should be designed for perfect & attractive placement on a 13.33” wide by 7.5” tall slide.

        Your output should follow the structure precisely and be formatted as valid JSON.
        """



        if int(slide_pages) <= 5:                 # restricting the tokens output 
            response = text_model.generate_content(prompt,generation_config={"max_output_tokens": 5000, "temperature": 0.7,})
            print(response)
            return response.text.strip()
        
        if int(slide_pages) <= 10:                 # restricting the tokens output 
            response = text_model.generate_content(prompt,generation_config={"max_output_tokens": 7000, "temperature": 0.7,})
            print(response)
            return response.text.strip()
        
        elif int(slide_pages) <=15:               # restricting the tokens outut
            response = text_model.generate_content(prompt,generation_config={"max_output_tokens": 12000, "temperature": 0.8,})
            print(response)
            return response.text.strip()
        
        elif int(slide_pages) <=20:               # restricting the tokens outut
            response = text_model.generate_content(prompt,generation_config={"max_output_tokens": 20000, "temperature": 0.9,})
            print(response)
            return response.text.strip()
        
        elif int(slide_pages) > 20:               # restricting the tokens outut
            response = text_model.generate_content(prompt,generation_config={"max_output_tokens": 20000, "temperature": 0.9,})
            print(response)
            return response.text.strip()
        
    except Exception as e:
        print(f"[ERROR] Failed to fetch content from Gemini: {e}")
        return "Need to upgrade "
    




# ========================== OpenAI API Setup ==========================
import openai

openai.api_key = "your-api-key-here"  # Replace with your actual API key

def generate_openai(topic, slides):
    try:
        slides = int(slides)
        prompt = f"Create a detailed presentation on: {topic}, that data fits in {slides} slides."

        if slides <= 5:
            tokens = 700
        elif slides <= 10:
            tokens = 900
        elif slides <= 15:
            tokens = 1400
        elif slides <= 20:
            tokens = 2000
        else:
            tokens = 3000

        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=tokens,
            temperature=0.7
        )
        content = response.choices[0].message.content.strip()
        # slide_data = parse_ai_content_to_slides(content)

    except Exception as e:
        return f"Error generating OpenAI content: {e}"


# ========================== Claude API Setup ==========================

import anthropic
import os

anthropic_client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

def generate_haiku(topic, slides):
    try:
        slides = int(slides)
        prompt = f"Create a detailed presentation on: {topic}, that data fits in {slides} slides."

        if slides <= 5:
            tokens = 700
        elif slides <= 10:
            tokens = 1000
        elif slides <= 15:
            tokens = 1500
        elif slides <= 20:
            tokens = 2000
        else:
            tokens = 2700

        message = anthropic_client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=tokens,
            temperature=0.7,
            messages=[{"role": "user", "content": prompt}]
        )

        return ''.join(block.text for block in message.content)

    except Exception as e:
        return f"Error generating Claude content: {e}"
