import React from 'react';

const Evaluation = () => {
  return (
    <div className="evaluation-container">
      <h2>Course Evaluation</h2>
      
      <div className="evaluation-info">
        <p>Course evaluations for the current semester are not yet available.</p>
        <p>Evaluations typically open two weeks before the end of the semester.</p>
        <p>Please check back later.</p>
      </div>
      
      <div className="evaluation-placeholder">
        <div className="placeholder-icon">📋</div>
        <div className="placeholder-text">Evaluation forms will appear here when available</div>
      </div>
    </div>
  );
};

export default Evaluation;
