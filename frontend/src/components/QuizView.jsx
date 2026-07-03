import React, { useState } from 'react';
import { HelpCircle, ArrowRight, RotateCcw, Check, X, Award } from 'lucide-react';

export default function QuizView({ quiz }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  if (!quiz || quiz.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No quiz questions generated.
      </div>
    );
  }

  const currentQuestion = quiz[currentIdx];

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option.trim().toLowerCase() === currentQuestion.correct_answer.trim().toLowerCase();
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const percentage = (score / quiz.length) * 100;
    let message = "Keep studying! You can do better.";
    if (percentage === 100) {
      message = "Perfect score! You've mastered this material! 🌟";
    } else if (percentage >= 80) {
      message = "Great job! You have a solid grasp of this topic! 🎉";
    } else if (percentage >= 50) {
      message = "Good effort! Review the flashcards to improve. 👍";
    }

    return (
      <div className="quiz-results-card">
        <div className={`score-circle ${score === quiz.length ? 'perfect' : ''}`}>
          {score} / {quiz.length}
        </div>
        <h3 className="results-message">{message}</h3>
        <p className="results-sub">
          You answered {score} out of {quiz.length} questions correctly. Re-read the summary and concept definitions, then try again to get a perfect score.
        </p>
        <button className="restart-quiz-btn" onClick={restartQuiz}>
          <RotateCcw size={16} />
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <span className="quiz-progress">
          Question {currentIdx + 1} of {quiz.length}
        </span>
        <span className="quiz-score-badge">
          Current Score: {score}
        </span>
      </div>

      <div className="quiz-question-box">
        <h4 className="quiz-question">{currentQuestion.question}</h4>
        
        <div className="quiz-options">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option.trim().toLowerCase() === currentQuestion.correct_answer.trim().toLowerCase();
            
            let btnClass = '';
            let icon = null;

            if (isAnswered) {
              if (isCorrectOption) {
                btnClass = 'correct';
                icon = <Check size={16} style={{ marginLeft: 'auto', color: 'var(--accent-success)' }} />;
              } else if (isSelected) {
                btnClass = 'incorrect';
                icon = <X size={16} style={{ marginLeft: 'auto', color: 'var(--accent-error)' }} />;
              } else {
                btnClass = 'disabled';
              }
            } else {
              btnClass = isSelected ? 'selected' : '';
            }

            return (
              <button
                key={idx}
                className={`option-btn ${btnClass}`}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <span style={{ marginRight: '0.5rem', fontWeight: 600 }}>{String.fromCharCode(65 + idx)}.</span>
                <span>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="explanation-box">
            <h5 className="explanation-title">Explanation</h5>
            <p className="explanation-text">{currentQuestion.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <div className="quiz-footer">
            <button className="next-question-btn" onClick={handleNext}>
              {currentIdx === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
