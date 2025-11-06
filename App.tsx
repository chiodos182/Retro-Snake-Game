
import React, { useState, useCallback } from 'react';
import { GameState } from './types';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });

  const startGame = useCallback(() => {
    setScore(0);
    setGameState(GameState.PLAYING);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(GameState.PAUSED);
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, []);

  const gameOver = useCallback(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
    setGameState(GameState.GAME_OVER);
  }, [score, highScore]);

  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return <StartScreen onStart={startGame} />;
      case GameState.PLAYING:
      case GameState.PAUSED:
        return (
          <Game
            gameState={gameState}
            score={score}
            setScore={setScore}
            onGameOver={gameOver}
            onPause={pauseGame}
            onResume={resumeGame}
          />
        );
      case GameState.GAME_OVER:
        return <GameOverScreen score={score} highScore={highScore} onRestart={startGame} />;
      default:
        return <StartScreen onStart={startGame} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg aspect-square flex flex-col items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
