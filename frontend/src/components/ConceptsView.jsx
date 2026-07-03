import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function ConceptsView({ concepts }) {
  if (!concepts || concepts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No complex concepts generated.
      </div>
    );
  }

  return (
    <div>
      <h3 className="section-title">
        <Lightbulb size={20} style={{ color: 'var(--accent-secondary)' }} />
        Key Concepts (Simplified)
      </h3>
      <div className="concepts-grid">
        {concepts.map((item, index) => (
          <div key={index} className="concept-card">
            <h4 className="concept-name">
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--accent-secondary)',
                display: 'inline-block',
                flexShrink: 0
              }}></span>
              {item.concept}
            </h4>
            <p className="concept-explanation">{item.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
