import React from 'react';

interface ResultProps {
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h2 className="text-4xl font-bold text-gray-900">🏆 Game Over!</h2>
      <p className="text-lg text-gray-700">Thanks for playing Bingoji!</p>
      <button
        onClick={onRestart}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
      >
        Back to Title
      </button>
    </div>
  );
};

export default Result;
