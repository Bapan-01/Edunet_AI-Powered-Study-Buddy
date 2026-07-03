import React from 'react';
import { BookOpen } from 'lucide-react';

export default function SummaryView({ summary }) {
  if (!summary) return null;

  return (
    <div className="summary-container">
      <h3 className="section-title">
        <BookOpen size={20} style={{ color: 'var(--accent-primary)' }} />
        Short Summary
      </h3>
      <div className="summary-text">
        {summary}
      </div>
    </div>
  );
}
