import os
from fastapi import FastAPI
from google import genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

client = genai.Client(api_key=os.environ.get("GEMINI_KEY"))

@app.get("/health")
def health():
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents="Say hello to the English Learners in Japan!",
    )

    return {"message": response.text}
