from dotenv import load_dotenv
import os

load_dotenv()  # Loads the .env file into environment

# Access the values
client_id = os.getenv("REDDIT_CLIENT_ID")
client_secret = os.getenv("REDDIT_CLIENT_SECRET")
user_agent = os.getenv("REDDIT_USER_AGENT")
openai_api_key = os.getenv("OPENAI_API_KEY")

# Test print (Optional — remove later)
print(client_id, client_secret, user_agent, openai_api_key)