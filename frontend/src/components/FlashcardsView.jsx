import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, RefreshCw } from 'lucide-react';

export default function FlashcardsView({ flashcards }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No flashcards generated.
      </div>
    );
  }

  const currentCard = flashcards[currentIdx];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (currentIdx > 0) {
      setIsFlipped(false);
      // Wait for flip back animation before changing card text
      setTimeout(() => {
        setCurrentIdx(prev => prev - 1);
      }, 150);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIdx < flashcards.length - 1) {
      setIsFlipped(false);
      // Wait for flip back animation before changing card text
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, 150);
    }
  };

  const resetDeck = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx(0);
    }, 150);
  };

  return (
    <div className="flashcards-container">
      <h3 className="section-title" style={{ alignSelf: 'flex-start', width: '100%' }}>
        <RotateCw size={20} style={{ color: 'var(--accent-primary)' }} />
        Study Flashcards
      </h3>

      <div className="flashcard-wrapper" onClick={handleFlip}>
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
          
          {/* Front Face */}
          <div className="card-face front">
            <div className="card-label">
              <span>Card {currentIdx + 1}</span>
              <span>Front</span>
            </div>
            <div className="card-body">
              {currentCard.front}
            </div>
            <div className="card-hint">
              Click card to flip and view explanation
            </div>
          </div>

          {/* Back Face */}
          <div className="card-face back">
            <div className="card-label back-label">
              <span>Card {currentIdx + 1}</span>
              <span>Back</span>
            </div>
            <div className="card-body">
              {currentCard.back}
            </div>
            <div className="card-hint">
              Click card to flip back
            </div>
          </div>

        </div>
      </div>

      <div className="flashcard-controls">
        <button
          className="control-btn"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          title="Previous card"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="progress-text">
          {currentIdx + 1} of {flashcards.length}
        </span>

        <button
          className="control-btn"
          onClick={handleNext}
          disabled={currentIdx === flashcards.length - 1}
          title="Next card"
        >
          <ChevronRight size={20} />
        </button>

        <button
          className="control-btn"
          onClick={resetDeck}
          disabled={currentIdx === 0 && !isFlipped}
          title="Reset deck"
          style={{ marginLeft: '1rem' }}
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}
