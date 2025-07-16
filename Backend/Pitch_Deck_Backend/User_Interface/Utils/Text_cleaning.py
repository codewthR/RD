import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

def basic_clean(text: str) -> str:
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def remove_stopwords(text: str) -> str:
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text)
    return ' '.join([word for word in tokens if word not in stop_words])

def lemmatize_text(text: str) -> str:
    lemmatizer = WordNetLemmatizer()
    tokens = word_tokenize(text)
    return ' '.join([lemmatizer.lemmatize(word) for word in tokens])

def remove_duplicates(text):
    words = text.split()
    seen = set()
    result = []
    for word in words:
        if word not in seen:
            seen.add(word)
            result.append(word)
    return ' '.join(result)


def clean_text_pipeline(text: str) -> str:
    text = basic_clean(text)
    text = remove_stopwords(text)
    text = remove_duplicates(text)
    return lemmatize_text(text)



#====================================converting accurate json data for UI ============================================

import json
import re

def parse_ai_raw_text(ai_raw_text):
    """
    Extracts and parses JSON data from a raw string containing a JSON code block.

    Parameters:
        ai_raw_text (str): A string containing JSON within ```json ... ``` formatting.

    Returns:
        list or dict: Parsed JSON data if successful.
        None: If parsing fails.
    """
    try:
        
        cleaned_text = re.sub(r'^```json\n|```$', '', ai_raw_text.strip(), flags=re.MULTILINE)
        
       
        parsed_json = json.loads(cleaned_text)
        
        print("✅ JSON parsed successfully!")
        return parsed_json

    except json.JSONDecodeError as e:
        print("❌ Error parsing JSON:", e)
        return None
