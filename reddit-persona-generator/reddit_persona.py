# reddit_persona.py

import sys
import os
from utils.scraper import extract_username, get_user_activity
from utils.persona_builder import generate_persona

def save_to_file(username, persona):
    filename = f"persona_{username}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(persona)
    print(f"\n✅ Persona saved to: {filename}")


def main():
    if len(sys.argv) != 2:
        print("Usage: python reddit_persona.py <reddit_profile_url>")
        return

    url = sys.argv[1]

    try:
        username = extract_username(url)
        print(f"📡 Fetching data for: {username}...")

        data = get_user_activity(username)

        print("🤖 Generating persona...")
        persona = generate_persona(data["posts"], data["comments"])

        save_to_file(username, persona)

    except Exception as e:
        print("❌ Error:", e)

if __name__ == "__main__":
    main()
