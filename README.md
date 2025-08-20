# Interview AI Coach

> An AI-powered interview practice platform that helps users improve their interview skills through personalized feedback and scoring.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x+-blue.svg)](https://reactjs.org/)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Roadmap](#roadmap)
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
- **Framework**: React 18+ with modern hooks
- **Styling**: TailwindCSS for utility-first styling
- **Components**: Shadcn/UI component library
- **HTTP Client**: Axios for API communication
- **Build Tool**: Vite for fast development and building

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
Interview-AI-Coach/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Helper functions
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend server
│   ├── server.js           # Application entry point
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # Express route definitions
│   ├── controllers/        # Business logic handlers
│   ├── middleware/         # Custom middleware functions
│   ├── utils/              # Helper utilities
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
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
   git clone https://github.com/your-username/interview-ai-coach.git
   cd interview-ai-coach
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

### Backend Environment Setup

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongo_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# AI Integration
PERPLEXITY_API_KEY=your_perplexity_api_key

# Optional: Logging
LOG_LEVEL=info
```

### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Interview AI Coach
```

## Usage

### Starting the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on: `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: `http://localhost:3000`

### Using the Platform

1. **Register/Login**: Create an account or sign in to access the platform
2. **Start Interview**: Begin a new mock interview session
3. **Answer Questions**: Respond to AI-generated questions via text or voice
4. **Review Feedback**: Receive instant scoring, feedback, and improvement suggestions
5. **Track Progress**: Monitor your performance over time through the dashboard

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login and token generation |
| GET | `/api/auth/profile` | Get user profile information |

### Interview Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/start` | Generate new interview questions |
| POST | `/api/interview/answer` | Submit answer and receive AI feedback |
| GET | `/api/interview/:id` | Retrieve specific interview session |
| GET | `/api/interview/history` | Get user's interview history |

### Request/Response Examples

#### Start Interview
```javascript
// Request
POST /api/interview/start
{
  "category": "software-engineering",
  "difficulty": "intermediate",
  "questionCount": 5
}

// Response
{
  "interviewId": "64a7b8c9d1e2f3g4h5i6j7k8",
  "questions": [
    {
      "id": "q1",
      "text": "Tell me about your experience with React.js",
      "category": "technical"
    }
  ]
}
```

## Development

### Development Scripts

**Backend**
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run test       # Run test suite
npm run lint       # Run ESLint
```

**Frontend**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run test       # Run tests
```

### Development Guidelines

- Use ESLint and Prettier for code formatting
- Write unit tests for new features
- Follow REST API conventions
- Implement proper error handling
- Use TypeScript for type safety (recommended)

### Common Issues

- **MongoDB Connection**: Ensure MongoDB is running and connection string is correct
- **API Key**: Verify Perplexity API key is valid and has sufficient credits
- **CORS Issues**: Check frontend and backend URLs match your environment
- **Voice Recording**: Ensure microphone permissions are enabled in browser

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

**Built with ❤️ by [Your Name]**

For support or questions, please open an issue on GitHub or contact [your-email@example.com]
