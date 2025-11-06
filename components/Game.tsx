
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Direction, Coordinates } from '../types';
import {
  GRID_SIZE,
  INITIAL_SNAKE_POSITION,
  INITIAL_DIRECTION,
  INITIAL_SNAKE_SPEED,
  SPEED_INCREMENT,
  MIN_SPEED,
} from '../constants';
import GameBoard from './GameBoard';

interface GameProps {
  gameState: GameState;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onGameOver: () => void;
  onPause: () => void;
  onResume: () => void;
}

const ArrowUpIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
  </svg>
);
const ArrowDownIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
  </svg>
);
const ArrowRightIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
  </svg>
);
const PauseIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
    </svg>
);
const PlayIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
    </svg>
);


const Game: React.FC<GameProps> = ({ gameState, score, setScore, onGameOver, onPause, onResume }) => {
  const [snake, setSnake] = useState<Coordinates[]>(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState<Coordinates>(() => generateRandomFood(INITIAL_SNAKE_POSITION));
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [speed, setSpeed] = useState<number>(INITIAL_SNAKE_SPEED);
  const directionQueue = useRef<Direction[]>([]);

  // Sound effect placeholders
  const playEatSound = () => new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg').play().catch(e => {});
  const playGameOverSound = () => new Audio('https://actions.google.com/sounds/v1/cartoon/game_over_bleeps.ogg').play().catch(e => {});

  const resetGame = () => {
    setSnake(INITIAL_SNAKE_POSITION);
    setFood(generateRandomFood(INITIAL_SNAKE_POSITION));
    setDirection(INITIAL_DIRECTION);
    setSpeed(INITIAL_SNAKE_SPEED);
    directionQueue.current = [];
  };

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      resetGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState === GameState.PLAYING]); // This should only run when the game starts

  const handleDirectionChange = useCallback((newDirection: Direction) => {
    const lastDirection = directionQueue.current.length > 0 ? directionQueue.current[directionQueue.current.length - 1] : direction;
    if (
      (newDirection === 'UP' && lastDirection !== 'DOWN') ||
      (newDirection === 'DOWN' && lastDirection !== 'UP') ||
      (newDirection === 'LEFT' && lastDirection !== 'RIGHT') ||
      (newDirection === 'RIGHT' && lastDirection !== 'LEFT')
    ) {
      directionQueue.current.push(newDirection);
    }
  }, [direction]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          handleDirectionChange('UP');
          break;
        case 'ArrowDown':
          handleDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
          handleDirectionChange('LEFT');
          break;
        case 'ArrowRight':
          handleDirectionChange('RIGHT');
          break;
        case ' ': // Spacebar
        case 'p':
          if (gameState === GameState.PLAYING) onPause();
          else if (gameState === GameState.PAUSED) onResume();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectionChange, gameState, onPause, onResume]);

  const moveSnake = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;
    
    let currentDirection = direction;
    if (directionQueue.current.length > 0) {
      currentDirection = directionQueue.current.shift()!;
      setDirection(currentDirection);
    }

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (currentDirection) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        playGameOverSound();
        onGameOver();
        return prevSnake;
      }

      // Self collision
      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          playGameOverSound();
          onGameOver();
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        playEatSound();
        setScore((s) => s + 1);
        setFood(generateRandomFood(newSnake));
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameState, onGameOver, setScore, food, direction]);

  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed, gameState]);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <header className="flex justify-between items-center p-2 border-b-2 border-slate-700">
        <h2 className="text-lg">SCORE: <span className="text-green-400">{score}</span></h2>
        <button
          onClick={gameState === GameState.PLAYING ? onPause : onResume}
          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {gameState === GameState.PLAYING ? <PauseIcon /> : <PlayIcon />}
        </button>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-2">
        <GameBoard snake={snake} food={food} />
      </main>

      <footer className="p-4 flex justify-center">
        <div className="grid grid-cols-3 gap-2 w-48">
          <div />
          <button onClick={() => handleDirectionChange('UP')} className="control-btn col-start-2"><ArrowUpIcon /></button>
          <div />
          <button onClick={() => handleDirectionChange('LEFT')} className="control-btn"><ArrowLeftIcon /></button>
          <button onClick={() => handleDirectionChange('DOWN')} className="control-btn"><ArrowDownIcon /></button>
          <button onClick={() => handleDirectionChange('RIGHT')} className="control-btn"><ArrowRightIcon /></button>
        </div>
      </footer>
       <style>{`
        .control-btn {
          @apply p-4 bg-slate-700 rounded-lg flex items-center justify-center active:bg-green-500 hover:bg-slate-600 transition-colors;
        }
      `}</style>
    </div>
  );
};

function generateRandomFood(snakeBody: Coordinates[]): Coordinates {
  let foodPosition: Coordinates;
  do {
    foodPosition = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snakeBody.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y));
  return foodPosition;
}

export default Game;
