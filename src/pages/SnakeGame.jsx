import React, { useState, useEffect, useCallback } from "react";

const CANVAS_SIZE = 500;
const SCALE = 10;
const INITIAL_SNAKE = Array.from({ length: 10 }, (_, i) => [i, 0]);
const DIRECTIONS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

const getRandomFood = () => {
  const x = Math.floor(Math.random() * (CANVAS_SIZE / SCALE));
  const y = Math.floor(Math.random() * (CANVAS_SIZE / SCALE));
  return [x, y];
};

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(getRandomFood);
  const [direction, setDirection] = useState([1, 0]);
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = newSnake[0];
      const newHead = [
        (head[0] + direction[0] + CANVAS_SIZE / SCALE) % (CANVAS_SIZE / SCALE),
        (head[1] + direction[1] + CANVAS_SIZE / SCALE) % (CANVAS_SIZE / SCALE),
      ];

      if (newSnake.some((segment) => segment[0] === newHead[0] && segment[1] === newHead[1])) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(newHead);

      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setFood(getRandomFood);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(moveSnake, 100);
    return () => clearInterval(interval);
  }, [moveSnake, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (DIRECTIONS[e.key]) {
        setDirection(DIRECTIONS[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood);
    setDirection([1, 0]);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div
        className="relative"
        style={{
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          backgroundColor: "black",
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              width: SCALE,
              height: SCALE,
              backgroundColor: "white",
              left: `${segment[0] * SCALE}px`,
              top: `${segment[1] * SCALE}px`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            width: SCALE,
            height: SCALE,
            backgroundColor: "red",
            left: `${food[0] * SCALE}px`,
            top: `${food[1] * SCALE}px`,
          }}
        />
      </div>
      {gameOver && (
        <div className="mt-4 text-white">
          <p>Game Over!</p>
          <button
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
            onClick={resetGame}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;