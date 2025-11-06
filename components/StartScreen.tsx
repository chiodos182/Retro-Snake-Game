
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center bg-slate-800 p-8 rounded-lg shadow-2xl w-full h-full border-2 border-slate-700">
      <h1 className="text-5xl md:text-6xl font-bold text-green-400 mb-4">RETRO SNAKE</h1>
      <p className="text-slate-300 mb-8">Use arrow keys or touch controls to move.</p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-green-500 text-slate-900 font-bold text-2xl rounded-lg hover:bg-green-400 transition-colors focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        START GAME
      </button>
    </div>
  );
};

export default StartScreen;
