import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Question {
  id: string;
  question: string;
  imageUrl?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

interface PreSelectionTest {
  id: string;
  jobId: string;
  isActive: boolean;
  questions: Question[];
}

const TakePreSelectionTest: React.FC<{ jobId: string; applicantId: string }> = ({ jobId, applicantId }) => {
  const [test, setTest] = useState<PreSelectionTest | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`/preSelectionTest/job/${jobId}`);
        setTest(response.data.test);
      } catch (error: any) {
        setMessage('Error: ' + error.message);
      }
    };
    fetchTest();
  }, [jobId]);

  const handleOptionChange = (questionId: string, selectedOption: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!test) return;
    const answersArray = test.questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id] || '',
    }));
    try {
      const response = await axios.post('/preSelectionTest/result', {
        applicantId,
        testId: test.id,
        answers: answersArray,
      });
      setMessage('Test submitted successfully!');
      console.log(response.data);
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    }
  };

  if (!test) return <div>Loading test...</div>;

  return (
    <div>
      <h2>Pre‑Selection Test</h2>
      <form onSubmit={handleSubmit}>
        {test.questions.map((q, index) => (
          <div key={q.id} style={{ marginBottom: '20px' }}>
            <h4>
              {index + 1}. {q.question}
            </h4>
            {q.imageUrl && <img src={q.imageUrl} alt={`Question ${index + 1}`} style={{ maxWidth: '300px' }} />}
            <div>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  value="a"
                  onChange={() => handleOptionChange(q.id, 'a')}
                />
                {q.option_a}
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  value="b"
                  onChange={() => handleOptionChange(q.id, 'b')}
                />
                {q.option_b}
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  value="c"
                  onChange={() => handleOptionChange(q.id, 'c')}
                />
                {q.option_c}
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  value="d"
                  onChange={() => handleOptionChange(q.id, 'd')}
                />
                {q.option_d}
              </label>
            </div>
          </div>
        ))}
        <button type="submit">Submit Test</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TakePreSelectionTest;
