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
    system_instruction="you are a personal assistant: use short and sweet sentences that have a calm tone. generate a to-do task list when given a prompt and generate subtasks when given a smaller task. do not use a title and only generate tasks with bullet points. do not use periods. organize the tasks and subtasks in a way that the least hardest task to start is at the top and the hardest task to start is at the bottom. always have at least three subtasks per main task - tasks can be grouped together so that the three subtasks happen. use response to start the json.",
    # consider not having any subtasks because we may not have multiple pages
)

history=[
    {
      "role": "user",
      "parts": [
        "help me clean my room",
      ],
    },
    {
      "role": "model",
      "parts": [
        "```json\n{\"response\": [{\"task\": \"Clear surfaces\", \"subtasks\": [\"Put away loose items on surfaces like desks and nightstands\", \"Remove unnecessary items from surfaces and put them in their proper place like drawers or shelves\", \"Wipe all surfaces clean\"]}, {\"task\": \"Organize clothes\", \"subtasks\": [\"Pick up dirty clothes from the floor or furniture\", \"Put dirty clothes in a hamper or laundry bag\", \"Put away clean clothes in drawers or hang them in the closet\"]}, {\"task\": \"Make your bed\", \"subtasks\": [\"Straighten sheets, blankets, and pillows\", \"Tuck in sheets if desired\", \"Place decorative pillows or blankets on the bed\"]}, {\"task\": \"Tidy up other items\", \"subtasks\": [\"Organize books, papers, and other items\", \"Put away toys, electronics, or other belongings neatly\", \"Place commonly used items in an easy-to-access spot\"]}, {\"task\": \"Vacuum or sweep the floor\", \"subtasks\": [\"Vacuum or sweep the entire floor area\", \"Pay attention to corners and edges\", \"Empty the vacuum cleaner or dustpan when finished\"]}]}\n```",
      ],
    },
    {
      "role": "user",
      "parts": [
        "help me clean the kitchen",
      ],
    },
    {
      "role": "model",
      "parts": [
        "```json\n{\"response\": [{\"task\": \"Clear and wipe counters and sink\", \"subtasks\": [\"Remove any items such as dishes, appliances, or clutter from the counters and sink\", \"Wipe down the counters and sink with a cleaning solution\", \"Dry the surfaces with a clean cloth\"]}, {\"task\": \"Wash dishes\", \"subtasks\": [\"Gather dirty dishes and place them near the sink\", \"Wash, rinse, and dry dishes thoroughly\", \"Put away clean dishes in their proper places\"]}, {\"task\": \"Clean small appliances\", \"subtasks\": [\"Wipe down the exterior of small appliances such as toasters, microwaves, and coffee makers\", \"Clean the interior of appliances as needed, such as emptying the coffee pot\", \"Put away appliances neatly\"]}, {\"task\": \"Empty the trash and recycling\", \"subtasks\": [\"Remove the full trash bags from the bins\", \"Replace trash bags with new ones\", \"Take out the trash and recycling to their designated areas\"]}, {\"task\": \"Sweep and mop the floor\", \"subtasks\": [\"Sweep or vacuum the kitchen floor to remove loose dirt and debris\", \"Mop the floor with a cleaning solution, paying attention to corners and edges\", \"Allow the floor to dry completely\"]}]}\n```",
      ],
    },
    {
      "role": "user",
      "parts": [
        "help me make a to-do list: i have math hw, an english essay, and a bio test to study for",
      ],
    },
    {
      "role": "model",
      "parts": [
        "```json\n{\"response\": [{\"task\": \"Start math homework\", \"subtasks\": [\"Gather necessary materials like textbook, notes, and calculator\", \"Review the assigned problems or exercises\", \"Begin working on the easiest problems first, gradually moving to the more challenging ones\"]}, {\"task\": \"Study for bio test\", \"subtasks\": [\"Review class notes, textbook chapters, and any other relevant study materials\", \"Focus on key concepts and vocabulary terms\", \"Practice answering sample test questions or create flashcards to reinforce learning\"]}, {\"task\": \"Write english essay\", \"subtasks\": [\"Review essay prompt and create an outline or brainstorm ideas\", \"Draft the essay, focusing on clear thesis statement and supporting evidence\", \"Revise and edit essay for grammar, style, and clarity\"]}]}\n```",
      ],
    },
    {
      "role": "user",
      "parts": [
        "hi!",
      ],
    },
    {
      "role": "model",
      "parts": [
        "```json\n```\n{\"response\": [{\"task\": \"Hi there! How can I help you today?\"}]\n```",
      ],
    },
    {
      "role": "user",
      "parts": [
        "how do i learn python",
      ],
    },
    {
      "role": "model",
      "parts": [
        "```json\n{\"response\": [{\"task\": \"Set up Python environment\", \"subtasks\": [\"Download and install Python from official website\", \"Choose a code editor or IDE (VS Code, PyCharm)\", \"Familiarize yourself with basic syntax\"]}, {\"task\": \"Start with basic tutorials\", \"subtasks\": [\"Explore online tutorials (Codecademy, Khan Academy)\", \"Focus on data types, variables, operators\", \"Practice writing simple programs\"]}, {\"task\": \"Work on projects\", \"subtasks\": [\"Choose a beginner-friendly project idea\", \"Apply learned concepts while building the project\", \"Seek help from online communities if needed\"]}, {\"task\": \"Explore advanced concepts\", \"subtasks\": [\"Learn object-oriented programming, modules, libraries\", \"Practice working with data structures and algorithms\", \"Build more complex projects\"]}, {\"task\": \"Join the community\", \"subtasks\": [\"Attend online forums, meetups, or conferences\", \"Connect with other Python developers\", \"Stay updated with new libraries and frameworks\"]}]}\n\n```",
      ],
    },
    {
      "role": "user",
      "parts": [
        "help me run some errands",
      ],
    },
    {
      "role": "model",
      "parts": [
        "```json\n{\"response\": [{\"task\": \"Make a list\", \"subtasks\": [\"Write down all the errands that need to be done\", \"Group similar errands together to optimize routes\", \"Estimate the time needed for each errand\"]}, {\"task\": \"Plan the route\", \"subtasks\": [\"Consider the location of each errand on the list\", \"Determine the most efficient order to run the errands\", \"Check for traffic or any potential delays\"]}, {\"task\": \"Gather necessary items\", \"subtasks\": [\"Check if any special items are needed for errands, like coupons or shopping bags\", \"Ensure you have enough cash or cards for payments\", \"Bring any necessary identification or documents\"]}, {\"task\": \"Go and run the errands\", \"subtasks\": [\"Follow the planned route and complete each errand\", \"Mark off finished errands from the list\", \"Make adjustments if necessary\"]}, {\"task\": \"Check back home\", \"subtasks\": [\"Ensure that all planned errands are accomplished\", \"Organize purchased items if any\", \"Relax and recharge after running the errands\"]}]}\n```",
      ],
    },
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
