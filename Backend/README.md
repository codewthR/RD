| Component                       | Purpose                                 | Suggested Tools/Models                          |
| ------------------------------- | --------------------------------------- | ----------------------------------------------- |
| Text Summarization/Parsing      | Extract slide-worthy info from raw text | Text summarization, spaCy, NLTK                 |
| Content Structuring Model       | Divide content into logical slides      | Custom rules, clustering, ML models             |
| Slide Layout & Design Generator | Choose slide templates and layouts      | Rule-based templates, python-pptx slide layouts |
| PPT Generation Engine           | Convert content+layout to PPTX file     | python-pptx, Aspose.Slides                      |
| Optional Image Generation Model | Create visuals for slides               | DALL·E                                          |
| Theme & Style Selector          | Apply consistent look & feel            | Rule-based or ML recommender                    |
| API / UI Layer                  | User interaction & PPT delivery         | Django/Flask backend, React/HTML frontend       |


# 1. Text Understanding & Content Structuring Model
## Purpose: Parse raw input text and extract meaningful slide content:

Titles

Bullet points / key points

Section headers

Paragraph summaries



# 2. Slide Layout & Design Model (optional but recommended)
## Purpose: Decide how the slide content should be organized visually:

Slide templates (title slide, bullet slide, image+text slide)

Positioning of content blocks

Font styles and sizes

Color themes matching the user’s choice or default themes


# 3. Text to PPT Generation Engine
## Purpose: Convert structured content + layouts into actual PPT slides

Required Tools:

python-pptx library (generating PPTX files in Python)

Libraries to add images, charts, and formatted text

APIs or frameworks if doing in other languages (Google Gemni 2.0 flash)





# Create A folder 

# git clone https://github.com/SapnnaRajput/Ai-PitchDeck-Backend.git

# Create a virtual enviorment 

# Install All dependencies 

# Command : pip install -r requirements.txt

# Run Django project  : Python manage.py runserver

# For Frontend--

# Create new frontend folder 

# git clone --branch master --single-branch https://github.com/SapnnaRajput/Ai-PitchDeck-Backend.git

# run command :  npm install 

# npm run dev