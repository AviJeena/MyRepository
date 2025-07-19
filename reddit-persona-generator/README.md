# Reddit User Persona Generator

This project takes a Reddit user profile URL and generates a detailed **user persona** using AI — based on the user's **posts and comments**. It cites the original posts or comments used to infer each trait in the persona.

This project was created as part of a Generative AI internship assignment.

---

## 🔧 Technologies Used

- Python
- PRAW (Reddit API wrapper)
- Hugging Face Transformers (offline AI model)
- BeautifulSoup (for HTML scraping fallback)
- dotenv (to manage API keys securely)
- Text file output for persona results

---

## 📦 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/reddit-persona-generator.git
   cd reddit-persona-generator

2. Install dependencies:
   pip install -r requirements.txt

3. (Optional) Create a virtual environment:
   python -m venv venv
   source venv/bin/activate   # or venv\Scripts\activate on Windows

### 🔐 Configuration
Create a .env file in the root folder with the following:
   REDDIT_CLIENT_ID=your_reddit_client_id
   REDDIT_CLIENT_SECRET=your_reddit_client_secret
   REDDIT_USER_AGENT=your_user_agent_string
   NOTE-: ⚠️ OpenAI API key is not required — the model runs offline using HuggingFace Transformers.

### 🚀 How to Run
To generate a persona for a Reddit user:
   python reddit_persona.py https://www.reddit.com/user/Hungry-Move-6603/
   This will:
    - Scrape recent posts and comments
    - Generate a detailed user persona
    - Save the output in a file like persona_Hungry-Move-6603.txt

### 📁 Output
Each output .txt file contains:
    - Age range
    - Personality traits
    - Interests
    - Political views
    - Writing style
    - Citations to specific Reddit posts/comments

### ✅ Sample Users
This repo includes outputs for:
    - u/kojied
    - u/Hungry-Move-6603
Check the files:
    - persona_kojied.txt
    - persona_Hungry-Move-6603.txt

### 🙏 License
This code was developed strictly for the purpose of an internship evaluation and is not intended for commercial use.

### 📌 Notes
This solution works fully offline — no OpenAI billing is required.
The script avoids storing credentials by using a .env file (excluded via .gitignore)

---

### ✅ What to Do

1. Open your `README.md`
2. Replace **everything** with the above content
3. Save the file
4. Run:
   ```bash
   git add README.md
   git commit -m "Updated README for final submission"
   git push














