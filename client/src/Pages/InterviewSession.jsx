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
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    fetchQuestions();
    
    // Log browser support info
    console.log('Browser support check:', {
      browserSupportsSpeechRecognition,
      isSecureContext: window.isSecureContext,
      userAgent: navigator.userAgent,
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    });
    
    // Check if SpeechRecognition is available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      console.log('Native SpeechRecognition available:', !!SpeechRecognition);
    }
    
    // Check browser support on mount
    if (!browserSupportsSpeechRecognition) {
      setVoiceError('Your browser does not support speech recognition. Please use Chrome, Edge, or another Chromium-based browser for the best experience.');
    }
    
    // Check microphone permission
    checkMicrophonePermission();
  }, []);

  useEffect(() => {
    if (transcript) {
      console.log('Transcript updated:', transcript);
      setCurrentAnswer(transcript);
    }
  }, [transcript]);
  
  useEffect(() => {
    console.log('Listening state changed:', listening);
  }, [listening]);

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
      // Check if we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext) {
        setHasPermission(false);
        setVoiceError('Speech recognition requires HTTPS. Please use https:// or localhost.');
        console.warn('Not in secure context');
        return;
      }
      
      console.log('Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');
      setHasPermission(true);
      setVoiceError(null);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Microphone permission error:', error);
      setHasPermission(false);
      const errorMessage = error.name === 'NotAllowedError' 
        ? 'Microphone access denied. Please enable microphone permissions in your browser settings.'
        : error.name === 'NotFoundError'
        ? 'No microphone found. Please connect a microphone and try again.'
        : error.name === 'NotReadableError'
        ? 'Microphone is being used by another application. Please close other apps using the microphone.'
        : `Microphone error: ${error.message}`;
      setVoiceError(errorMessage);
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
    console.log('startListening called', { hasPermission, browserSupportsSpeechRecognition, isSecureContext: window.isSecureContext });
    
    // Check browser support first
    if (!browserSupportsSpeechRecognition) {
      const errorMsg = 'Your browser does not support speech recognition. Please use Chrome, Edge, or another Chromium-based browser.';
      setVoiceError(errorMsg);
      console.error('Browser does not support speech recognition');
      return;
    }
    
    // Check secure context
    if (!window.isSecureContext) {
      const errorMsg = 'Speech recognition requires HTTPS. Please use https:// or localhost.';
      setVoiceError(errorMsg);
      console.error('Not in secure context');
      return;
    }
    
    // Check and request permission if needed
    if (!hasPermission) {
      console.log('No permission, requesting...');
      await checkMicrophonePermission();
      if (!hasPermission) {
        console.error('Permission denied after request');
        return;
      }
    }
    
    try {
      console.log('Starting speech recognition...');
      resetTranscript();
      setVoiceError(null);
      // SpeechRecognition.startListening is not async in v4
      SpeechRecognition.startListening({ 
        continuous: true, 
        language: 'en-US',
        interimResults: true
      });
      console.log('Speech recognition started');
    } catch (error) {
      console.error('Speech recognition error:', error);
      setVoiceError(`Failed to start speech recognition: ${error.message || 'Unknown error'}`);
      // Try to check permissions again
      await checkMicrophonePermission();
    }
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
            {listening && transcript && (
              <div className="transcript-preview" style={{ 
                marginTop: '10px', 
                padding: '10px', 
                background: '#f0f0f0', 
                borderRadius: '4px',
                fontSize: '14px',
                color: '#666'
              }}>
                <strong>Live transcript:</strong> {transcript}
              </div>
            )}
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
                disabled={listening || !browserSupportsSpeechRecognition || isSubmitting || (!window.isSecureContext && window.location.protocol !== 'https:')}
                title={
                  !browserSupportsSpeechRecognition 
                    ? 'Browser does not support speech recognition'
                    : !window.isSecureContext && window.location.protocol !== 'https:'
                    ? 'HTTPS required for speech recognition'
                    : listening
                    ? 'Recording in progress...'
                    : 'Click to start recording'
                }
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
                <span className={`status-value ${hasPermission && isMicrophoneAvailable !== false ? 'allowed' : 'denied'}`}>
                  {hasPermission && isMicrophoneAvailable !== false ? '✅ Allowed' : '❌ Denied'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Secure Context:</span>
                <span className={`status-value ${window.isSecureContext ? 'allowed' : 'denied'}`}>
                  {window.isSecureContext ? '✅ Yes' : '❌ No (HTTPS required)'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Status:</span>
                <span className={`status-value ${listening ? 'allowed' : 'denied'}`}>
                  {listening ? '🔴 Recording' : '⚪ Idle'}
                </span>
              </div>
              {transcript && (
                <div className="status-item">
                  <span className="status-label">Transcript Length:</span>
                  <span className="status-value allowed">
                    {transcript.length} chars
                  </span>
                </div>
              )}
            </div>

            {(!browserSupportsSpeechRecognition || !hasPermission || !window.isSecureContext) && (
              <div className="voice-troubleshooting">
                <h4>🔧 Troubleshooting Voice Recognition</h4>
                <ul>
                  {!browserSupportsSpeechRecognition && (
                    <li>Use Chrome, Edge, or another Chromium-based browser for best support</li>
                  )}
                  {!window.isSecureContext && (
                    <li>Speech recognition requires HTTPS. Make sure you're using <code>https://</code> or <code>localhost</code></li>
                  )}
                  {!hasPermission && (
                    <li>Click the address bar and allow microphone access, or check your browser's privacy settings</li>
                  )}
                  <li>Make sure your microphone is connected and working</li>
                  <li>Try refreshing the page after granting permissions</li>
                </ul>
              </div>
            )}
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
