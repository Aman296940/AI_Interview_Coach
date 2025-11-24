# AI Interview Coach

A practice platform for interview prep with AI-generated questions and real-time feedback. Helps you improve your answers and track your progress over time.

## What it does

Practice interviews for different roles and difficulty levels. The AI generates questions, you answer them (text or voice), and you get instant feedback with scores and suggestions for improvement.

## Features

- AI question generation using Perplexity API
- Text or voice input for answers
- Real-time scoring and feedback
- Confidence analysis for voice responses
- Performance tracking and analytics
- Personalized study recommendations

## Tech Stack

**Frontend:**
- React 19 + Vite
- TailwindCSS
- Axios for API calls
- react-speech-recognition for voice input

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Perplexity AI for question generation

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Perplexity API key

### Installation

1. Clone the repo:
```bash
git clone https://github.com/Aman296940/AI_Interview_Coach.git
cd AI_Interview_Coach
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

### Configuration

Create a `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PERPLEXITY_API_KEY=your_perplexity_key
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000
```

### Running Locally

Start the backend:
```bash
cd server
npm start
```

Start the frontend:
```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

## Voice Input

Uses the browser's Web Speech API. Works best in Chrome/Edge. Make sure to:
- Grant microphone permissions
- Use HTTPS (or localhost)
- Have a working microphone

## Deployment

### Backend (Railway)

1. Sign up at [railway.app](https://railway.app)
2. Create a new project from your GitHub repo
3. Set root directory to `server` in service settings
4. Add environment variables:
   - `MONGO_URI` (URL-encode special chars in password: `@` → `%40`)
   - `JWT_SECRET`
   - `PERPLEXITY_API_KEY`
   - `FRONTEND_URL` (your Vercel URL)
5. Deploy and note your Railway URL

### Frontend (Vercel)

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set root directory to `client`
4. Add environment variable:
   - `VITE_API_URL` = your Railway backend URL
5. Deploy

### Important Notes

- Set `VITE_API_URL` in Vercel to point to your Railway backend
- Set `FRONTEND_URL` in Railway to your Vercel URL
- If MongoDB password has special characters, URL-encode them
- CORS is configured to allow all `.vercel.app` domains automatically

## API Endpoints

**Auth:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh token

**Interview:**
- `GET /api/interview/questions?role=...&level=...` - Get questions
- `POST /api/interview/voice-submit` - Submit answer
- `POST /api/interview/finalize` - End interview
- `GET /api/interview/:id` - Get interview details

## Troubleshooting

**405 errors on API calls:**
- Make sure `VITE_API_URL` is set in Vercel environment variables

**CORS errors:**
- Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Check Railway logs for CORS messages

**Database connection issues:**
- URL-encode special characters in MongoDB password
- Check MongoDB Atlas network access settings

**Voice not working:**
- Check browser console for errors
- Verify microphone permissions
- Make sure you're on HTTPS or localhost

## Project Structure

```
AI_Interview_Coach/
├── client/          # React frontend
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Services/
│   │   └── contexts/
│   └── package.json
├── server/          # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
└── README.md
```

## License

MIT License

---

Built by [Aman Bajoria](https://github.com/Aman296940)
