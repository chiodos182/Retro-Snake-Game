
import React from 'react';
import { Coordinates } from '../types';
import { GRID_SIZE } from '../constants';

interface GameBoardProps {
  snake: Coordinates[];
  food: Coordinates;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food }) => {
  const isSnake = (x: number, y: number) => snake.some(segment => segment.x === x && segment.y === y);
  const isSnakeHead = (x: number, y: number) => snake[0].x === x && snake[0].y === y;
  const isFood = (x: number, y: number) => food.x === x && food.y === y;

  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const key = `${x}-${y}`;
      let cellClass = 'bg-slate-800';
      if (isSnake(x, y)) {
        cellClass = isSnakeHead(x, y) ? 'bg-green-300' : 'bg-green-500';
      } else if (isFood(x, y)) {
        cellClass = 'bg-red-500';
      }
      cells.push(<div key={key} className={cellClass}></div>);
    }
  }

  return (
    <div
      className="grid bg-slate-700 border-2 border-slate-600 shadow-lg"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        width: '100%',
        height: '100%',
        aspectRatio: '1 / 1',
      }}
    >
      {cells}
    </div>
  );
};

export default React.memo(GameBoard);
