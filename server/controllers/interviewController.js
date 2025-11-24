import Interview from '../models/Interview.js';
import { generateText, perplexity } from '../utils/perplexityClient.js';
import { analyzeAnswer, analyzeConfidence, detectTopic } from '../utils/ai.js';

const cleanQuestionText = (questionText) => {
  if (!questionText) return '';
  return questionText
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/^[-•]\s*/, '')
    .trim();
};

const FALLBACK_QUESTIONS = {
  'HR': {
    'junior': [
      'What is your understanding of employee confidentiality?',
      'How would you handle a conflict between two employees?',
      'What are the key components of an effective onboarding process?',
      'How do you ensure fair treatment in the workplace?',
      'What is your approach to handling employee complaints?'
    ],
    'medium': [
      'How would you design an employee retention strategy?',
      'What metrics would you use to measure HR effectiveness?',
      'How do you handle performance improvement plans?',
      'What is your approach to diversity and inclusion initiatives?',
      'How would you manage organizational change from an HR perspective?'
    ]
  },
  'Software Engineer': {
    'junior': [
      'What is the difference between an array and a linked list?',
      'Explain the concept of Big O notation.',
      'How do you approach debugging a program?',
      'What is the difference between stack and heap memory?',
      'Explain the concept of recursion with an example.'
    ],
    'medium': [
      'Design a system to handle 1 million concurrent users.',
      'Explain the differences between SQL and NoSQL databases.',
      'How would you optimize a slow database query?',
      'What are the principles of RESTful API design?',
      'Explain the concept of microservices architecture.'
    ]
  }
};

export const getQuestions = async (req, res, next) => {
  const { role, level } = req.query;
  try {
    if (!role || !level) {
      return res.status(400).json({ error: 'Role and level parameters are required' });
    }
    try {
      const { text } = await generateText({
        model: perplexity('sonar-pro'),
        prompt: `Generate 5 ${level}-level ${role} interview questions in a numbered list.`,
      });
      const list = text
        .trim()
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => /^\d+\.\s/.test(l))
        .map((l) => cleanQuestionText(l));
      if (list.length >= 3) {
        return res.json(list);
      } else {
        throw new Error('Insufficient questions generated');
      }
    } catch (aiError) {
      const fallbackQuestions = FALLBACK_QUESTIONS[role]?.[level.toLowerCase()] ||
        FALLBACK_QUESTIONS['Software Engineer']['medium'];
      const cleanedFallback = fallbackQuestions.map(q => cleanQuestionText(q));
      return res.json(cleanedFallback);
    }
  } catch (err) {
    next(err);
  }
};

export const voiceSubmit = async (req, res) => {
  try {
    const { interviewId, question, answer } = req.body;
    if (!interviewId || interviewId === 'undefined') {
      return res.status(400).json({ error: "Invalid or missing interviewId" });
    }
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }
    let confidenceResult = { score: 50, feedback: "Unable to analyze confidence" };
    try {
      confidenceResult = analyzeConfidence(answer);
    } catch (err) {
      console.error("Confidence analysis failed:", err);
    }
    
    // Get role from interview for better evaluation
    const role = interview.type || 'Software Engineer';
    let aiResult = {
      score: 50,
      feedback: "Unable to analyze answer",
      suggestedAnswer: "Focus on clear technical explanations",
      topic: "Programming"
    };
    try {
      aiResult = await analyzeAnswer(question, answer);
    } catch (e) {
      console.error("AI analysis failed:", e);
    }
    // Combine AI analysis with confidence analysis
    const combined = {
      score: Math.max(0, Math.min(100, aiResult.score || 50)),
      feedback: aiResult.feedback || "No feedback available",
      confidence: Math.max(0, Math.min(100, confidenceResult.score || 50)),
      confidenceFeedback: confidenceResult.feedback || "Unable to analyze confidence",
      suggestedAnswer: aiResult.suggestedAnswer || "Focus on clear explanations",
      topic: aiResult.topic || detectTopic(question),
      strengths: aiResult.strengths || [],
      improvements: aiResult.improvements || []
    };
    
    // Calculate weighted final score (70% content score, 30% confidence)
    const weightedScore = Math.round(
      (combined.score * 0.7) + (combined.confidence * 0.3)
    );
    combined.score = weightedScore;
    interview.responses.push({
      question,
      answer,
      ...combined
    });
    await interview.save();
    res.json(combined);
  } catch (err) {
    console.error("voiceSubmit error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const startInterview = async (req, res, next) => {
  try {
    const { type, difficulty, questions } = req.body;
    const interview = await Interview.create({
      user: req.user.id,
      type,
      difficulty,
      totalQuestions: questions?.length || 5,
      responses: [],
    });
    res.json({ interviewId: interview._id });
  } catch (err) {
    next(err);
  }
};

export const finalizeInterview = async (req, res, next) => {
  const { interviewId } = req.body;
  try {
    const interview = await Interview.findById(interviewId);
    if (!interview || !interview.responses?.length) {
      return res.status(404).json({ error: 'Interview not found or empty' });
    }
    const totalWeight = interview.responses.reduce(
      (sum, r) => sum + (r.weight || 1),
      0
    );
    const totalScore = interview.responses.reduce(
      (sum, r) => sum + r.score * (r.weight || 1),
      0
    );
    interview.finalScore = Math.round(totalScore / totalWeight);
    await interview.save();
    res.json({ finalScore: interview.finalScore });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const list = await Interview.find({ user: req.user.id })
      .select('_id type difficulty createdAt finalScore')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const getInterviewById = async (req, res, next) => {
  try {
    const doc = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};
