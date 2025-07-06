import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  question: String,
  answer: String,
  score: Number,
  feedback: String,
  confidence: Number,
  confidenceFeedback: String,
  suggestedAnswer: String,
  topic: String,
  timestamp: { type: Date, default: Date.now }
});

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: String,
  difficulty: String,
  totalQuestions: { type: Number, default: 5 },
  responses: [responseSchema],
  finalScore: Number,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

export default mongoose.model('Interview', interviewSchema);
