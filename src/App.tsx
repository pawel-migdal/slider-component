import { useState } from 'react';
import './App.css';
import Slider from './slider';

interface LabelsInterface {
  right: string;
  left: string;
  top: string;
  bottom: string;
  topEmoji: string;
  rightEmoji: string;
  bottomEmoji: string;
  leftEmoji: string;
}

function App() {
  const [position, setPosition] = useState({ x: 250, y: 250 });
  const [normalizedCoords, setNormalizedCoords] = useState({ x: 0, y: 0 });

  const labels: LabelsInterface = {
    right: "Formal",
    left: "Casual",
    top: "Ecstatic",
    bottom: "Furious",
    topEmoji: "😀",
    rightEmoji: "👔",
    bottomEmoji: "😡",
    leftEmoji: "👖"
  }

  return (
    <div>
      <h2>Example 1: Bare bones</h2>
      <Slider
        position={position}
        setPosition={setPosition}
        onChange={setNormalizedCoords}
        tracker={false}
        grid={false}
      />


      <h2>Example 2: With tracker and grid</h2>
      <Slider
        position={position}
        setPosition={setPosition}
        onChange={setNormalizedCoords}
        tracker={true}
        grid={true}
      />


      <h2>Example 3: With tracker, grid, and labels</h2>
      <Slider
        position={position}
        setPosition={setPosition}
        onChange={setNormalizedCoords}
        tracker={true}
        grid={true}
        labels={labels}
      />


      {/* Example of accessing the normalized coordinates from outside the component */}
      <div className="external-usage">
        <h3>External Access to Coordinates:</h3>
        <p>Normalized X: {normalizedCoords.x}</p>
        <p>Normalized Y: {normalizedCoords.y}</p>
      </div>
    </div>
  );
}

export default App;
