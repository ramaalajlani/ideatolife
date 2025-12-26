import React from 'react';
import ListSection from './ListSection';

const ReportLists = ({ strengths, weaknesses, recommendations }) => (
  <div className="space-y-4">
    <ListSection
      title="Strengths"
      items={strengths}
      type="strengths"
    />
    <ListSection
      title="Improvement Areas"
      items={weaknesses}
      type="weaknesses"
    />
    <ListSection
      title="Recommendations"
      items={recommendations}
      type="recommendations"
    />
  </div>
);

export default ReportLists;