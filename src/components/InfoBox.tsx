import React from 'react';


// InfoBox.tsx
import '../styles/InfoBox.css'; // Import the styles

const InfoBox: React.FC = () => {
  return (
    <div className="info-box">
      <h2>Right Side Container</h2>
      <p>This is a container on the right-hand side of the page, occupying 30% of its width. You can add any content here!</p>
    </div>
  );
};

export default InfoBox;
