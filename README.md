# How to Use Softsteps
main task — simply click on a main task's "+" button <br>
subtask — hold 'shift' and click on a main task's "+" button OR click on a subtasks's "+" button <br>
generated tasks — press 'shift' + 'enter' to generate tasks

"uvicorn main:app --reload" for running backend server (generated tasks)<br>
npm start for running website

# Implementing Firebase
1. Go to https://console.firebase.google.com/u/0/ & create a new Firebase project
2. In the top left, where it shows a settings icon — click & navigate to "Project Settings"
3. Scroll down and find SDKs
4. In /src, create an .env file and create variables:
   REACT_APP_FIREBASE_API_KEY=(insert)
  REACT_APP_FIREBASE_AUTH_DOMAIN=(insert)
  REACT_APP_FIREBASE_PROJECT_ID=(insert)
  REACT_APP_FIREBASE_STORAGE_BUCKET=(insert)
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=(insert)
  REACT_APP_FIREBASE_APP_ID=(insert)
  REACT_APP_FIREBASE_MEASUREMENT_ID=(insert)

# What is Softsteps?
Softsteps was created help with motivation and minimizing the time lost with procrastination. Throughout the first two years of highschool, I noticed that using a to-do list was really useful with my procrastination but it works wonders when the tasks are further broken down into small steps — so that the tasks seem more managable and I will be more willing to start the tasks (which is my biggest obstacle). However, when I manually break down the steps, I will spend too much creating the to-do list where the to-do list is practically procrastination because it's like I'm using it as an excuse to start my work a little later. I realized that I had to fix this problem so that I can both use a to-do list but not have to manually break down the tasks myself. 

The solution I came up with is a to-do list web application with the ability to automatically generate subtasks using AI to fulfill the need for tasks to be broken down. With this, I no longer waste time breaking down tasks manually and isntead, I can start working much sooner.

# Choices in Choosing Tech
Softsteps is a web application because I use the Google Calendar website(this seems to be really weird but I prefer websites over most software apps — even discord) for time management meaning that I will already have my laptop out. Therefore, this is the most convenient and efficient way for me to access the to-do list. The web application will use React, a JavaScript library, because of its ability to develop a dynamic single-page interface. Additionally, React was chosen because of its component-based framework, making it easy to manage UI elements. This structure will work well with nesting components together to form the UI. For the backend, I implemented Firebase Firestore, a cloud-hosted NoSQL database, that provides real-time syncing across sessions. Firestore can automatically save and load data in after refreshing or opening the application. Furthermore, Firebase works well with React to support data ordering, updates, and document subcollections. The document subcollections will be helpful when handling nested data structures like subtasks under a task. Then, to generate subtasks based on user input, I used Gemini API from Google’s Generative AI toolkit. Additionally, Python with FastAPI is used for the backend because it supports fast, asynchronous requests, handles JSON efficiently, and works well with React for creating lightweight APIs.
