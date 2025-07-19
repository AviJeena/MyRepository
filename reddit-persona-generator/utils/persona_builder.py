# utils/persona_builder.py

from transformers import pipeline, set_seed
import torch

def build_prompt(posts, comments):
    content = "Generate a Reddit user persona based on the following activity.\n"
    content += "Include: Age, Profession, Interests, Personality, Writing Style.\n\n"

    content += "POSTS:\n"
    for post in posts[:5]:  # Limit to keep it small
        content += f"Title: {post['title']}\nText: {post['text'][:300]}\n\n"

    content += "COMMENTS:\n"
    for comment in comments[:5]:
        content += f"Comment: {comment['body'][:300]}\n\n"

    return content


def generate_persona(posts, comments):
    prompt = build_prompt(posts, comments)

    generator = pipeline('text-generation', model='distilgpt2')
    set_seed(42)

    result = generator(prompt, max_length=500, num_return_sequences=1)

    return result[0]['generated_text']
