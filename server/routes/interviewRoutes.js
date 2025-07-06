import express from 'express';
import auth from '../middlewares/authMiddleWare.js';
import {
  getQuestions,
  startInterview,
  voiceSubmit,
  getHistory,
  getInterviewById,
  finalizeInterview,
} from '../controllers/interviewController.js';

const router = express.Router();

router.get('/questions', auth, getQuestions);
router.post('/start-interview', auth, startInterview);
router.post('/voice-submit', auth, voiceSubmit);      // NEW
router.get('/history', auth, getHistory);
router.get('/:id', auth, getInterviewById);
router.post('/finalize', auth, finalizeInterview);

export default router;
