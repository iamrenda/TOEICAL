import os
from fastapi import FastAPI
from google import genai
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI()
client = genai.Client(api_key=os.environ.get("GEMINI_KEY"))

class ApiResponse:
    def __init__(self, status: str, data: str):
        self.status = status
        self.data = data

class WritingAnalysisRequest(BaseModel):
    topic: str
    description: str
    essay: str
    difficulty: str
    timeLimit: int
    timeTaken: int
    wordCount: int

class WritingAnalysisResponse(BaseModel):
    structure_score: int
    topic_relevancy_score: int
    grammar_score: int
    vocabulary_score: int
    overall_score: int
    revised_essay: str
    feedback_summary: str

@app.get("/health")
def health():
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents="Say hello to the English Learners in Japan!",
    )

    return {"status": "success", "data": response.text}

@app.post("/ai/writing/analysis")
def postAnalysis(request: WritingAnalysisRequest):
    prompt_contents = [
        f"Topic: {request.topic}",
        f"Description: {request.description}",
        f"Difficulty: {request.difficulty}",
        f"Time Limit: {request.timeLimit} minutes",
        f"Time Taken: {request.timeTaken} minutes",
        f"Word Count: {request.wordCount}",
        f"User Essay: {request.essay}",
        "Analyze the following essay and provide feedback based on the criteria mentioned in the system instruction."
    ]

    system_instruction = (
        "You are an expert English teacher providing feedback to a Japanese English learner. "
        "Analyze the essay based on structure, topic relevancy, grammar, vocabulary, and overall quality. "
        "Rate every category score on a scale from 1 to 100 (where 100 is perfect). "
        "Provide a revised version of the essay with improvements. "
        "Write the 'feedback_summary' in clear, encouraging Japanese so the learner can easily understand it."
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt_contents,
        config={
            "system_instruction": system_instruction,
            "temperature": 0.7,
            "response_mime_type": "application/json",
            "response_schema": WritingAnalysisResponse
        },
    )

    if (not response.parsed):
        return {"status": "error", "data": None, "error": "Failed to parse response from AI model." }

    return {"status": "success", "data": response.parsed, "error": None }