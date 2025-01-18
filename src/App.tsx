import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import NavBar from './components/NavBar';
import Map from './components/Map'; // Import the Map component
import InfoBox from './components/InfoBox';
import './App.css'; // Optional: Add CSS for map styling


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
