import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import api from '../Services/api';
import './InterviewSession.css';
import FeedbackCardsInterface from './FeedbackCardsInterface';
import { useNavigate } from 'react-router-dom';




const InterviewSession = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  const interviewId = searchParams.get('interviewId');
  const role = searchParams.get('role');
  const level = searchParams.get('level');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    fetchQuestions();
    checkMicrophonePermission();
  }, []);

  useEffect(() => {
    if (transcript) setCurrentAnswer(transcript);
  }, [transcript]);

  const cleanQuestionText = (questionText) => {
    if (!questionText) return '';
    return questionText
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/^\d+\.\s*/, '')
      .replace(/^[-•]\s*/, '')
      .trim();
  };

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      setVoiceError(null);
      stream.getTracks().forEach(track => track.stop());
    } catch {
      setHasPermission(false);
      setVoiceError('Microphone access denied. Please enable microphone permissions.');
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/api/interview/questions?role=${role}&level=${level}`);
      const cleaned = response.data.map(q => cleanQuestionText(q));
      setQuestions(cleaned);
    } catch (error) {
      setFeedbackError('Failed to load questions. Please refresh.');
    }
  };

  const startListening = async () => {
    if (!hasPermission) {
      await checkMicrophonePermission();
      return;
    }
    if (!browserSupportsSpeechRecognition) {
      setVoiceError('Your browser does not support speech recognition.');
      return;
    }
    resetTranscript();
    setVoiceError(null);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const stopListening = () => SpeechRecognition.stopListening();
  
  const clearTranscript = () => {
    resetTranscript();
    setCurrentAnswer('');
  };

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer before submitting.');
      return;
    }
    setIsSubmitting(true);
    setFeedbackError(null);
    
    try {
      const response = await api.post('/api/interview/voice-submit', {
        interviewId,
        question: questions[currentQuestionIndex],
        answer: currentAnswer
      });
      
      setCurrentFeedback({
        score: response.data.score || 50,
        confidence: response.data.confidence || 50,
        feedback: response.data.feedback || "No feedback available",
        confidenceFeedback: response.data.confidenceFeedback || "Unable to analyze confidence",
        suggestedAnswer: response.data.suggestedAnswer || "Focus on providing clear, technical explanations",
        topic: response.data.topic || "Programming Concepts",
        strengths: response.data.strengths || [],
        improvements: response.data.improvements || [],
        currentQuestion: questions[currentQuestionIndex]
      });
    } catch (error) {
      setFeedbackError(
        error.response?.data?.error ||
        'Failed to process your answer. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setCurrentAnswer('');
      setCurrentFeedback(null);
      resetTranscript();
    } else {
      finalizeInterview();
    }
  };

  const finalizeInterview = async () => {
    try {
      await api.post('/api/interview/finalize', { interviewId });
      navigate('/dashboard');
    } catch {
      alert('Failed to finalize interview.');
    }
  };

  if (questions.length === 0) {
    return (
      <div className="interview-session">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading interview questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-session">
      <div className="interview-header">
        <h1>Interview Session</h1>
        <div className="interview-meta">
          <span className="role-badge">{role}</span>
          <span className="level-badge">{level}</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
      </div>

      <div className="question-section">
        <div className="question-header">
          <h2>
            <span className="question-icon">❓</span>
            Question {currentQuestionIndex + 1}
          </h2>
        </div>
        <div className="question-content">
          <p className="question-text">
            {cleanQuestionText(questions[currentQuestionIndex])}
          </p>
        </div>
      </div>

      {!currentFeedback && (
        <div className="answer-section">
          <div className="answer-header">
            <h3>
              <span className="answer-icon">✍️</span>
              Your Answer
            </h3>
            <div className="input-mode-indicator">
              {listening ? (
                <span className="recording-indicator">🔴 Recording...</span>
              ) : (
                <span className="typing-indicator">⌨️ Type or speak your answer</span>
              )}
            </div>
          </div>
          
          <div className="answer-input-container">
            <textarea
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here or use the microphone button to speak..."
              rows="6"
              disabled={isSubmitting}
              className="answer-textarea"
            />
            <div className="character-counter">
              {currentAnswer.length} characters
            </div>
          </div>

          <div className="voice-controls">
            {voiceError && (
              <div className="voice-error">
                <span className="error-icon">⚠️</span>
                {voiceError}
                <button className="retry-permission-btn" onClick={checkMicrophonePermission}>
                  Retry
                </button>
              </div>
            )}
            
            <div className="voice-buttons">
              <button
                className={`voice-button start-recording ${listening ? 'active' : ''}`}
                onClick={startListening}
                disabled={listening || !hasPermission || isSubmitting}
              >
                <span className="button-icon">🎤</span>
                {listening ? 'Recording...' : 'Start Recording'}
              </button>
              
              <button
                className="voice-button stop-recording"
                onClick={stopListening}
                disabled={!listening || isSubmitting}
              >
                <span className="button-icon">⏹️</span>
                Stop Recording
              </button>
              
              <button
                className="voice-button clear-transcript"
                onClick={clearTranscript}
                disabled={!currentAnswer || isSubmitting}
              >
                <span className="button-icon">🗑️</span>
                Clear
              </button>
            </div>

            <div className="voice-status">
              <div className="status-item">
                <span className="status-label">Browser Support:</span>
                <span className={`status-value ${browserSupportsSpeechRecognition ? 'supported' : 'not-supported'}`}>
                  {browserSupportsSpeechRecognition ? '✅ Supported' : '❌ Not Supported'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Microphone:</span>
                <span className={`status-value ${hasPermission ? 'allowed' : 'denied'}`}>
                  {hasPermission ? '✅ Allowed' : '❌ Denied'}
                </span>
              </div>
            </div>
          </div>

          <div className="submit-container">
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={isSubmitting || !currentAnswer.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Analyzing Answer...
                </>
              ) : (
                <>
                  <span className="submit-icon">📤</span>
                  Submit Answer
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {feedbackError && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {feedbackError}
          <button className="dismiss-error" onClick={() => setFeedbackError(null)}>
            ×
          </button>
        </div>
      )}

      {currentFeedback && (
        <div className="feedback-section">
          <FeedbackCardsInterface feedbackData={currentFeedback} />
          <div className="next-question-container">
            <button
              className="next-question-button"
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  <span className="next-icon">➡️</span>
                  Next Question
                </>
              ) : (
                <>
                  <span className="complete-icon">🎉</span>
                  Complete Interview
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
