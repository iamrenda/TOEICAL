import os
from fastapi import FastAPI
from google import genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "FastAPI service is running online"}