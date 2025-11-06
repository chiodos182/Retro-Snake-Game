
import React from 'react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center bg-slate-800 p-8 rounded-lg shadow-2xl w-full h-full border-2 border-slate-700">
      <h1 className="text-5xl md:text-6xl font-bold text-red-500 mb-4">GAME OVER</h1>
      <div className="text-2xl text-slate-300 mb-2">
        SCORE: <span className="font-bold text-green-400">{score}</span>
      </div>
      <div className="text-xl text-slate-400 mb-8">
        HIGH SCORE: <span className="font-bold text-yellow-400">{highScore}</span>
      </div>
      <button
        onClick={onRestart}
        className="px-8 py-4 bg-green-500 text-slate-900 font-bold text-2xl rounded-lg hover:bg-green-400 transition-colors focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        PLAY AGAIN
      </button>
    </div>
  );
};

export default GameOverScreen;
