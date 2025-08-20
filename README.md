# Interview AI Coach

An AI-powered Interview Practice platform where users can attend mock interviews, answer questions, and receive **personalized feedback, scoring, better answers, and study topics** to improve their performance.  

The system has a **frontend (React)** for user interaction and a **backend (Node.js + Express + MongoDB)** for authentication, question generation, and evaluation.

---

## 🚀 Features
- 🎤 **AI-powered interview questions** (via Perplexity API).
- 📊 **Answer evaluation** with scoring (0–100), feedback, better answers, and study topics.
- 🔒 **Authentication system** (JWT & bcrypt).
- 🗄 **MongoDB database** for storing users, questions, and answers.
- 🎙️ **Voice-based answers** (AI judges both content and confidence).
- 📈 **Final score calculation** using weighted average logic.
- 🖥 **Interactive frontend dashboard**:
  - List of interviews
  - Detailed session view with question-wise feedback

---

## 📂 Project Structure

Interview-AI-Coach/
│── frontend/ # React frontend (UI, dashboards, interview flow)
│── backend/ # Node.js + Express server
│ ├── server.js # Main entry point
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── controllers/ # Business logic
│ ├── .env # Environment variables
│── package.json # Server dependencies
│── package-lock.json

---

## ⚙️ Tech Stack

**Frontend**
- React + TailwindCSS  
- Shadcn/UI (components)  
- Axios for API calls  

**Backend**
- Node.js + Express  
- MongoDB + Mongoose  
- JWT for authentication  
- bcryptjs for password hashing  
- dotenv for environment variables  

**AI Integration**
- [Perplexity AI SDK](https://www.npmjs.com/package/@ai-sdk/perplexity)  

---

## 🔧 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/interview-ai-coach.git
cd interview-ai-coach
```

Setup Backend

bash 
cd backend
npm install
Create a .env file inside backend/ with:

ini

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PERPLEXITY_API_KEY=your_api_key
Run the backend:

bash

npm start
Setup Frontend

bash

cd frontend
npm install
npm run dev
Frontend runs on 👉 http://localhost:3000
Backend runs on 👉 http://localhost:5000

📊 API Endpoints
Auth
POST /api/auth/register → Register a user

POST /api/auth/login → Login & get token

Interview
POST /api/interview/start → Generate interview questions

POST /api/interview/answer → Submit answer & get AI feedback

GET /api/interview/:id → Get interview session details

✅ Usage
Register/Login as a user

Start a new interview session

Answer questions (text/voice)

Receive:

Score (0–100)

Feedback

Suggested better answer

Study topic

At the end, view your final weighted score

🛠 Development Notes
Ensure MongoDB is running (local or Atlas)

Use a valid Perplexity API key

For voice answers, enable microphone access in the frontend

📌 Roadmap
 Add admin dashboard for question curation

 Export interview reports as PDF

 Integrate multiple AI models for scoring

 Add timed interviews

🤝 Contributing
Pull requests are welcome! Please open an issue to discuss major changes before submitting.

📜 License
This project is licensed under the MIT License.
