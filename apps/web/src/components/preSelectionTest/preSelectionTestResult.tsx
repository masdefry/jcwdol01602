import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Answer {
  id: string;
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}

interface TestResult {
  id: string;
  applicantId: string;
  testId: string;
  score: number;
  total: number;
  answers: Answer[];
}

const PreSelectionTestResult: React.FC<{ applicantId: string; testId: string }> = ({ applicantId, testId }) => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get('/preSelectionTest/result', {
          params: { applicantId, testId },
        });
        setResult(response.data.result);
      } catch (error: any) {
        setMessage('Error: ' + error.message);
      }
    };
    fetchResult();
  }, [applicantId, testId]);

  if (!result) return <div>Loading test result...</div>;

  return (
    <div>
      <h2>Test Result</h2>
      <p>
        Score: {result.score} out of {result.total}
      </p>
      <h3>Detailed Answers</h3>
      <ul>
        {result.answers.map((ans) => (
          <li key={ans.id}>
            Question ID: {ans.questionId} - Selected: {ans.selectedOption} - {ans.isCorrect ? 'Correct' : 'Incorrect'}
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PreSelectionTestResult;
