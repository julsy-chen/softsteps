import os
import google.generativeai as genai
import json
import logging
logging.basicConfig(level=logging.DEBUG)

from dotenv import load_dotenv
load_dotenv()

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# FastAPI setup
app = FastAPI()

# Enable CORS (allows frontend to communicate with backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a request model
class ToDoRequest(BaseModel):
    prompt: str

# Configure Gemini model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 512,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
    system_instruction="you are a personal assistant: use short and sweet sentences that have a calm tone. generate a to-do task list when given a prompt. do not use a title and only generate tasks with bullet points. do not use periods. organize the tasks in a way that the least hardest task to start is at the top and the hardest is at the bottom. use response to start the json. each task should be a string, do not include subtasks."
    # consider not having any subtasks because we may not have multiple pages
)

history = [
    {
        "role": "user",
        "parts": ["help me clean my room"]
    },
    {
        "role": "model",
        "parts": [
            "```json\n{\"response\": [\n  {\"task\": \"Pick up clothes\"},\n  {\"task\": \"Make the bed\"},\n  {\"task\": \"Organize the desk\"},\n  {\"task\": \"Throw away trash\"},\n  {\"task\": \"Vacuum the floor\"}\n]}\n```"
        ]
    },
    {
        "role": "user",
        "parts": ["help me make a to-do list: i have math hw, an english essay, and a bio test to study for"]
    },
    {
        "role": "model",
        "parts": [
            "```json\n{\"response\": [\n  {\"task\": \"Finish math homework\"},\n  {\"task\": \"Write English essay\"},\n  {\"task\": \"Study for biology quiz\"},\n  {\"task\": \"Review class notes\"},\n  {\"task\": \"Check upcoming deadlines\"}\n]}\n```"
        ]
    },
    {
        "role": "user",
        "parts": ["help me with chores"]
    },
    {
        "role": "model",
        "parts": [
            "```json\n{\"response\": [\n  {\"task\": \"Take out the trash\"},\n  {\"task\": \"Wipe kitchen counters\"},\n  {\"task\": \"Sweep the floor\"},\n  {\"task\": \"Do the laundry\"},\n  {\"task\": \"Feed the pets\"}\n]}\n```"
        ]
    },
    {
        "role": "user",
        "parts": ["how do I prepare for a test"]
    },
    {
        "role": "model",
        "parts": [
            "```json\n{\"response\": [\n  {\"task\": \"Gather all study materials\"},\n  {\"task\": \"Create a study schedule\"},\n  {\"task\": \"Review key concepts\"},\n  {\"task\": \"Practice sample questions\"},\n  {\"task\": \"Get a good night's sleep\"}\n]}\n```"
        ]
    },
    {
        "role": "user",
        "parts": ["help me get ready for a trip"]
    },
    {
        "role": "model",
        "parts": [
            "```json\n{\"response\": [\n  {\"task\": \"Make a packing list\"},\n  {\"task\": \"Book transportation\"},\n  {\"task\": \"Pack clothes and toiletries\"},\n  {\"task\": \"Charge electronics\"},\n  {\"task\": \"Check travel documents\"}\n]}\n```"
        ]
    }
]



@app.post("/generate-todo/")
async def generate_todo(request: ToDoRequest):
    try:
        requestDict = request.dict()
        print("Received request:", requestDict)
        # return {"message": "Request received"}
        chat_session = model.start_chat(
            history = history
        )

        print("requestDict[prompt]:", requestDict["prompt"])
        response = chat_session.send_message(requestDict["prompt"])

        modelResponse = response.text
        parsedResponse = json.loads(modelResponse)
        history.append({"role": "user", "parts": [requestDict["prompt"]]})
        history.append({"role": "model", "parts": [modelResponse]})
        return(parsedResponse['response'])
    
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the server: uvicorn main:app --reload

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
