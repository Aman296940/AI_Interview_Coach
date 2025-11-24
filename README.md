# AI Interview Coach

An AI-powered interview practice platform that helps users improve their interview skills through personalized feedback and scoring.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x+-blue.svg)](https://reactjs.org/)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Voice-to-Text Feature](#voice-to-text-feature)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Interview AI Coach is a comprehensive platform where users can practice mock interviews with AI-generated questions and receive detailed feedback. The system evaluates both content quality and delivery confidence, providing personalized recommendations to help users improve their interview performance.

### Key Capabilities

- **AI-Generated Questions**: Dynamic interview questions tailored to your field
- **Real-time Evaluation**: Instant scoring and feedback on your answers
- **Voice Analysis**: Assessment of both content and delivery confidence
- **Performance Tracking**: Detailed analytics and progress monitoring
- **Study Recommendations**: Personalized topics to focus on for improvement

## Features

### 🎤 Interview Experience

- AI-powered question generation via Perplexity API
- Support for both text and voice-based answers
- Real-time answer evaluation and scoring (0-100 scale)
- Confidence level assessment for voice responses

### 📊 Feedback & Analytics

- Detailed feedback on each answer
- Suggested improvements and better answer examples
- Personalized study topics based on performance gaps
- Final weighted score calculation across all responses

### 🔐 User Management

- Secure authentication system with JWT tokens
- Password hashing with bcrypt
- User session management
- Personal interview history tracking

### 📱 Interactive Dashboard

- Clean, responsive UI built with React and TailwindCSS
- Interview session management
- Detailed performance analytics
- Question-wise feedback breakdown

## Tech Stack

### Frontend

- **Framework**: React 19 with Vite
- **Styling**: TailwindCSS for utility-first styling
- **Components**: Material-UI and custom components
- **HTTP Client**: Axios for API communication
- **Build Tool**: Vite for fast development and building
- **Voice Recognition**: react-speech-recognition for voice input

### Backend

- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcryptjs hashing
- **Environment**: dotenv for configuration management
- **API Integration**: Perplexity AI SDK for intelligent question generation

### AI Integration

- **Question Generation**: [Perplexity AI API](https://www.perplexity.ai/)
- **Natural Language Processing**: Advanced AI models for answer evaluation

## Project Structure

```
AI_Interview_Coach/
├── client/                 # React frontend
│   ├── src/
│   │   ├── Components/     # Reusable components
│   │   ├── Pages/          # Page components
│   │   ├── Services/       # API service
│   │   ├── contexts/       # React contexts
│   │   └── hooks/          # Custom hooks
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database config
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
├── vercel.json             # Vercel configuration
└── README.md
```

## Installation

### Prerequisites

- Node.js (version 16.x or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager
- Perplexity API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aman296940/AI_Interview_Coach.git
   cd AI_Interview_Coach
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

## Configuration

### Backend Environment Setup

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# AI Integration
PERPLEXITY_API_KEY=your_perplexity_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000
```

## Usage

### Starting the Application

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server runs on: `http://localhost:5000`

2. **Start the frontend dev server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

### Using the Platform

1. **Register/Login**: Create an account or sign in to access the platform
2. **Start Interview**: Begin a new mock interview session
3. **Answer Questions**: Respond to AI-generated questions via text or voice
4. **Review Feedback**: Receive instant scoring, feedback, and improvement suggestions
5. **Track Progress**: Monitor your performance over time through the dashboard

## 🎤 Voice-to-Text Feature

The voice-to-text feature uses the Web Speech API. For best results:

- **Browser**: Use Chrome, Edge, or another Chromium-based browser
- **HTTPS**: Required for speech recognition (automatically provided by Vercel in production)
- **Permissions**: Grant microphone access when prompted
- **Microphone**: Ensure your microphone is connected and working

### Troubleshooting Voice Issues

If voice-to-text isn't working:

1. Check browser console for errors
2. Verify microphone permissions in browser settings
3. Ensure you're using HTTPS or localhost
4. Try refreshing the page after granting permissions
5. Check the status indicators in the interview session

## 📱 Deployment

### Deploy to Vercel

1. **Deploy Backend** (Railway/Render recommended)
   - Set root directory to `server`
   - Add all environment variables from `server/.env`
   - Note the deployment URL

2. **Deploy Frontend to Vercel**
   - Connect your GitHub repository
   - Set root directory to `client`
   - Add environment variable: `VITE_API_URL=your_backend_url`
   - Deploy!

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login and token generation |
| POST | `/api/auth/refresh-token` | Refresh JWT token |

### Interview Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/interview/questions?role=...&level=...` | Get interview questions |
| POST | `/api/interview/voice-submit` | Submit answer for feedback |
| POST | `/api/interview/finalize` | Finalize interview session |
| GET | `/api/interview/:id` | Get interview details |

### Request/Response Examples

#### Start Interview

```javascript
// Request
GET /api/interview/questions?role=software-engineer&level=intermediate

// Response
{
  "questions": [
    "Tell me about your experience with React.js",
    "How do you handle state management in large applications?",
    ...
  ]
}
```

## 🐛 Troubleshooting

### Build Issues
- Ensure all dependencies are installed
- Check Node.js version (v16+)
- Clear `node_modules` and reinstall if needed

### API Connection Issues
- Verify `VITE_API_URL` matches your backend URL
- Check CORS configuration in backend
- Ensure backend server is running

### Database Issues
- Verify MongoDB connection string
- Check MongoDB is running (if local)
- Verify network access (if MongoDB Atlas)

### Voice Recording Issues
- Ensure microphone permissions are enabled in browser
- Use Chrome or Edge for best compatibility
- Check that you're on HTTPS or localhost

## Development

### Development Scripts

**Backend**
```bash
npm start          # Start production server
npm run dev        # Start development server
npm test           # Run test suite
```

**Frontend**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Development Guidelines

- Use ESLint and Prettier for code formatting
- Write unit tests for new features
- Follow REST API conventions
- Implement proper error handling

## Roadmap

- [ ] **Admin Dashboard** - Question curation and user management
- [ ] **PDF Reports** - Export detailed interview performance reports
- [ ] **Multi-AI Integration** - Support for multiple AI models (OpenAI, Claude, etc.)
- [ ] **Timed Interviews** - Add time constraints for realistic practice
- [ ] **Video Analysis** - Body language and presentation skills assessment
- [ ] **Team Collaboration** - Share interviews with mentors or peers
- [ ] **Mobile App** - React Native mobile application
- [ ] **Advanced Analytics** - Industry benchmarking and trends

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup for Contributors

1. Follow the installation instructions above
2. Create a new branch for your feature
3. Make your changes and test thoroughly
4. Ensure all tests pass and code follows style guidelines
5. Submit a pull request with a clear description

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by [Aman Bajoria](https://github.com/Aman296940)**

For support or questions, please open an issue on GitHub.
