import React from 'react';
import './App.css'; // Optional: Add CSS for map styling
import InfoBox from './components/InfoBox';
import Map from './components/Map'; // Import the Map component


const App: React.FC = () => {
  return (
    <div className="container">
      {/* <NavBar /> */}
      <Map />
      <InfoBox />
    </div>
  );
};

export default App;
