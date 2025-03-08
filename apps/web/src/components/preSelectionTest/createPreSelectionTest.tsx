import React, { useState } from 'react';
import axios from 'axios';

interface QuestionInput {
  question: string;
  imageUrl?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: string;
}

const CreatePreSelectionTest: React.FC = () => {
  const [jobId, setJobId] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [questions, setQuestions] = useState<QuestionInput[]>(() =>
    Array.from({ length: 25 }, () => ({
      question: '',
      imageUrl: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      answer: '',
    }))
  );
  const [message, setMessage] = useState('');

  const handleQuestionChange = (
    index: number,
    field: keyof QuestionInput,
    value: string
  ) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/preSelectionTest', {
        jobId,
        isActive,
        questions,
      });
      setMessage('Test created successfully!');
      console.log(response.data);
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Create Pre‑Selection Test</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job ID:</label>
          <input
            type="text"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Activate Test:</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </div>
        <h3>Questions (25 required)</h3>
        {questions.map((q, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h4>Question {index + 1}</h4>
            <div>
              <label>Question:</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                value={q.imageUrl || ''}
                onChange={(e) => handleQuestionChange(index, 'imageUrl', e.target.value)}
              />
            </div>
            <div>
              <label>Option A:</label>
              <input
                type="text"
                value={q.option_a}
                onChange={(e) => handleQuestionChange(index, 'option_a', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Option B:</label>
              <input
                type="text"
                value={q.option_b}
                onChange={(e) => handleQuestionChange(index, 'option_b', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Option C:</label>
              <input
                type="text"
                value={q.option_c}
                onChange={(e) => handleQuestionChange(index, 'option_c', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Option D:</label>
              <input
                type="text"
                value={q.option_d}
                onChange={(e) => handleQuestionChange(index, 'option_d', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Correct Answer (a, b, c, or d):</label>
              <input
                type="text"
                value={q.answer}
                onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
        <button type="submit">Create Test</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreatePreSelectionTest;
