import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchQuestions, selectAnswer, resetQuiz, Question, updatePreviousSelections, clearCurrentSelections } from '../features/quiz/quizSlice';
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { 
    questions, 
    selectedAnswers, 
    status,
    currentCategory,
    currentDifficulty,
    currentAmount,
    previousCategory,
    previousDifficulty,
    previousAmount,
  } = useAppSelector(state => state.quiz);

  useEffect(() => {
    const shouldRefetch = 
      (currentCategory !== previousCategory) || 
      (currentDifficulty !== previousDifficulty) ||
      (currentAmount !== previousAmount);

    if (questions.length === 0) {
      dispatch(fetchQuestions());
      dispatch(updatePreviousSelections());
    }
    else if (shouldRefetch) {
      dispatch(clearCurrentSelections());
      dispatch(fetchQuestions());
      dispatch(updatePreviousSelections());
    } 
  }, [dispatch, questions.length, currentCategory, currentDifficulty, currentAmount, previousCategory, previousDifficulty, previousAmount]);

  const handleSubmit = () => {    navigate('/results');
  };

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div style={{ marginLeft: '30px', padding: '20px' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >Quiz</h1>
      {status === 'loading' && <p>Loading questions...</p>}

      {questions.map((q: Question) => (
        <div key={q.id} style={{ marginBottom: '20px' }}>
          <p>{q.question}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {q.answers.map((ans: string) => (
              <button
                key={ans}
                style={{
                  marginTop: '12px',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  border: selectedAnswers[q.id] === ans ? '1px solid green' : '1px solid green',
                  backgroundColor: selectedAnswers[q.id] === ans ? 'green' : '#fff',
                  cursor: 'pointer',
                  color: selectedAnswers[q.id] === ans ? '#fff' : 'green'
                }}
                onClick={() => dispatch(selectAnswer({ questionId: q.id, answer: ans }))}
              >
                {ans}
              </button>
            ))}
          </div>
        </div>
      ))}

      {allAnswered && (
        <button
          style={{
            marginTop: '12px',
            padding: '10px 15px',
            borderRadius: '5px',
            border: '1px solid green',
            backgroundColor: 'gray',
            cursor: 'pointer',
            color: 'white'
          }} 
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default QuizPage;