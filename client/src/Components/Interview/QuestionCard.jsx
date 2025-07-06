// Frontend Question Component:
// client/src/components/Interview/QuestionCard.jsx
import { useState } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';

export default function QuestionCard({ question, onSubmit }) {
  const [answer, setAnswer] = useState('');
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition();

  const handleSubmit = () => {
    onSubmit({
      question: question.question,
      answer: answer || transcript,
      isVoice: !!transcript
    });
  };

  return (
    <div className="question-card">
      <h3>{question.question}</h3>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
      />
      
      <div className="voice-controls">
        <button 
          onMouseDown={startListening} 
          onMouseUp={stopListening}
          className={listening ? 'recording' : ''}
        >
          {listening ? 'Recording...' : 'Hold to Record'}
        </button>
        <p>{transcript}</p>
      </div>

      <button onClick={handleSubmit}>Submit Answer</button>
    </div>
  );
}
