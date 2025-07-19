# test_persona.py

from utils.scraper import extract_username, get_user_activity
from utils.persona_builder import generate_persona

url = "https://www.reddit.com/user/Hungry-Move-6603/"
username = extract_username(url)
data = get_user_activity(username)

persona = generate_persona(data["posts"], data["comments"])

print("\n🧠 USER PERSONA:\n")
print(persona)
