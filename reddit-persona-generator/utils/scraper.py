# utils/scraper.py

import os
import praw
from dotenv import load_dotenv

# Load .env credentials
load_dotenv()

# Read Reddit API credentials
client_id = os.getenv("REDDIT_CLIENT_ID")
client_secret = os.getenv("REDDIT_CLIENT_SECRET")
user_agent = os.getenv("REDDIT_USER_AGENT")

# Initialize Reddit API client
reddit = praw.Reddit(
    client_id=client_id,
    client_secret=client_secret,
    user_agent=user_agent
)


def extract_username(url: str) -> str:
    """Extracts Reddit username from profile URL"""
    if "reddit.com/user/" in url:
        return url.strip("/").split("/")[-1]
    raise ValueError("Invalid Reddit profile URL")


def get_user_activity(username: str, limit=50) -> dict:
    """Fetches posts and comments of the user"""
    redditor = reddit.redditor(username)

    posts = []
    comments = []

    # Get posts (submissions)
    for submission in redditor.submissions.new(limit=limit):
        posts.append({
            "title": submission.title,
            "text": submission.selftext,
            "url": submission.url,
            "permalink": f"https://www.reddit.com{submission.permalink}"
        })

    # Get comments
    for comment in redditor.comments.new(limit=limit):
        comments.append({
            "body": comment.body,
            "link_permalink": f"https://www.reddit.com{comment.permalink}",
            "submission_title": comment.submission.title
        })

    return {"posts": posts, "comments": comments}
