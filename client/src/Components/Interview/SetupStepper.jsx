// Interview Type Selection
// client/src/components/Interview/SetupStepper.jsx
import { useState } from 'react';
import { Stepper, Step, StepLabel, Button } from '@mui/material';

const steps = ['Select Type', 'Choose Difficulty', 'Confirm'];

export default function SetupStepper({ onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState({
    type: 'SDE',
    difficulty: 'Medium'
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onComplete(selections);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <div className="setup-container">
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Step Content */}
      {activeStep === 0 && (
        <div className="step-content">
          <h3>Select Interview Type</h3>
          <select 
            value={selections.type} 
            onChange={(e) => setSelections({...selections, type: e.target.value})}
          >
            <option value="SDE">Software Development</option>
            <option value="DS">Data Science</option>
            <option value="ML">Machine Learning</option>
          </select>
        </div>
      )}
      
      {/* Add similar blocks for other steps */}
      
      <Button variant="contained" onClick={handleNext}>
        {activeStep === steps.length - 1 ? 'Start Interview' : 'Next'}
      </Button>
    </div>
  );
}
