'use client';
import React from 'react';

interface PreTestProps {
  onStart: () => void;
}

const PreTest: React.FC<PreTestProps> = ({ onStart }) => {
  return (
    <div className="py-2">
      <div className="bg-gray-200 p-4 rounded-lg shadow-md flex justify-center items-center flex-col">
        <h2 className="text-xl font-bold">Before You Begin</h2>
        <ul>
          <li>
            ✔ The test duration is <strong>1 hour</strong>.
          </li>
          <li>
            ✔ Please complete the test <strong>independently</strong>.
          </li>
          <li>
            ✔ You <strong>cannot go back</strong> or skip previous questions.
          </li>
        </ul>
        <button
          onClick={onStart}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 ease-in-out duration-150"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default PreTest;
