import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Using solid for a nicer completed view

const questions = [
  {
    id: 'directness',
    question: 'How direct do you prefer your communication to be?',
    options: [
      { value: 'very_direct', label: 'Very direct - say exactly what you mean' },
      { value: 'moderately_direct', label: 'Moderately direct - clear but polite' },
      { value: 'subtle', label: 'Subtle - prefer implied meaning' },
    ]
  },
  {
    id: 'formality',
    question: 'What level of formality do you prefer in professional settings?',
    options: [
      { value: 'formal', label: 'Formal - proper titles and structure' },
      { value: 'business_casual', label: 'Business casual - friendly but professional' },
      { value: 'casual', label: 'Casual - relaxed and conversational' },
    ]
  },
  {
    id: 'response_time',
    question: 'How do you prefer to handle response timing?',
    options: [
      { value: 'immediate', label: 'Respond immediately when possible' },
      { value: 'considered', label: 'Take time to craft thoughtful responses' },
      { value: 'flexible', label: 'Depends on the situation' },
    ]
  },
  {
    id: 'feedback_style',
    question: 'How do you prefer to receive feedback?',
    options: [
      { value: 'specific', label: 'Specific and detailed' },
      { value: 'gentle', label: 'Gentle with positive framing' },
      { value: 'balanced', label: 'Balanced mix of positive and constructive' },
    ]
  },
  {
    id: 'conflict_approach',
    question: 'How do you prefer to approach difficult conversations?',
    options: [
      { value: 'address_directly', label: 'Address issues directly and quickly' },
      { value: 'prepare_thoroughly', label: 'Prepare thoroughly before discussing' },
      { value: 'seek_mediation', label: 'Prefer neutral party involvement' },
    ]
  },
];

export function CommunicationAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const { updateProfile } = useProfile();

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    
    const { error } = await updateProfile({
      communication_style: answers,
      onboarding_completed: true,
    });

    if (!error) {
      setCompleted(true);
    }
    
    setSaving(false);
  };

  if (completed) {
    return (
      <div className="text-center py-12">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Assessment Complete!
        </h3>
        <p className="text-gray-600">
          Your preferences have been saved. Your suggestions are now personalized.
        </p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = !!answers[question.id];

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentQuestion) / questions.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          {question.question}
        </h3>
        
        <div className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option.value}
              className={`block p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                answers[question.id] === option.value
                  ? 'bg-primary/10 border-primary shadow-md'
                  : 'bg-white hover:bg-slate-50 border-gray-200'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={answers[question.id] === option.value}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                className="sr-only"
              />
              <span className="font-medium text-gray-800">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-5 py-2 text-sm font-medium text-primary bg-transparent border border-transparent rounded-lg hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canProceed || saving}
          className="px-6 py-2 text-sm font-bold text-white bg-primary border border-transparent rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
        >
          {saving ? (
            <LoadingSpinner />
          ) : (
            <>
              {isLastQuestion ? 'Complete Assessment' : 'Next'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}