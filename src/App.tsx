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
  const [position2, setPosition2] = useState({ x: 250, y: 250 });
  const [position3, setPosition3] = useState({ x: 250, y: 250 });

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
        tracker={false}
        grid={false}
      />


      <h2>Example 2: With tracker and grid</h2>
      <Slider
        position={position2}
        setPosition={setPosition2}
        tracker={true}
        grid={true}
      />


      <h2>Example 3: With tracker, grid, and labels</h2>
      <Slider
        position={position3}
        setPosition={setPosition3}
        tracker={true}
        grid={true}
        labels={labels}
      />


    </div>
  );
}

export default App;
