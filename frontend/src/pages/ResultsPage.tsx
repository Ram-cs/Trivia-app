import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../utils/hooks';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { resetQuiz, setScore } from '../features/quiz/quizSlice';

interface Result {
  id: string;
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  answers: string[];
}

const ResultsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedAnswers, questions, score, results, status } = useAppSelector(state => state.quiz);

  useEffect(() => {
    const submitAnswers = async () => {
      if (questions.length === 0) {
        navigate('/');
        return;
      }

      try {
        const payload = {
          answers: Object.entries(selectedAnswers).map(([id, answer]) => ({ id, answer })),
        };
        console.log('Submitting answers:', payload);
        const response = await axios.post('http://localhost:5001/api/quiz/score', payload);
        console.log('Score response:', response.data);
        dispatch(setScore({
          score: response.data.score,
          results: response.data.results
        }));
      } catch (error) {
        console.error('Failed to score quiz:', error);
        // Handle error appropriately
      }
    };

    if (results.length === 0 && questions.length > 0) {
      submitAnswers();
    }
  }, [selectedAnswers, dispatch, results.length, questions.length, navigate]);

  const getScoreColorClass = () => {
    // Map score to Tailwind background color classes
    if (score >= 4) return 'bg-green-500';
    if (score >= 2) return 'bg-red-500';
    return 'bg-red-500';
  };

  if (status === 'loading') {
    return (
      <div className="ml-8 p-5">
        <p>Calculating your score...</p>
      </div>
    );
  }

  return (
    <div className="ml-8 p-5">
       <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >Scoring and Results</h1>
      {results.map((res: Result) => {
        const question = questions.find((q: Question) => q.id === res.id);
        if (!question) return null; // Should not happen if data is consistent

        return (
          <div key={res.id} className="mb-5">
            <p>{question.question}</p>
            <div className="flex flex-wrap gap-2">
              {question.answers.map((ans: string) => {
                const isSelected = res.selected === ans;
                const isCorrect = res.correct === ans;

                let buttonClasses = 'px-4 py-2 rounded border cursor-default';

                if (isSelected && res.isCorrect) {
                  buttonClasses += ' border-green-400 bg-green-100 text-green-800';
                } else if (isSelected && !res.isCorrect) {
                  buttonClasses += ' border-red-300 bg-red-100 text-red-700';
                } else if (isCorrect && !isSelected) {
                  buttonClasses += ' border-green-400 bg-green-100 text-green-800';
                } else {
                   buttonClasses += ' border-gray-300 bg-white';
                }

                return (
                  <button
                    key={ans}
                    className={buttonClasses}
                    disabled // Buttons are not clickable in results view
                  >
                    {ans}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
	  )}

      {/* Removed the individual answer feedback text */}
	  <div className={`${
        getScoreColorClass()}
        text-white text-center p-2 mb-5 font-bold w-fit`}
      >
        You scored {score} out of 5
      </div>

      <button
        onClick={() => { dispatch(resetQuiz()); navigate('/'); }}
        className="mt-5 px-5 py-2 text-base cursor-pointer bg-gray-600 text-white border-none rounded"
      >
        Create a new quiz
      </button>
    </div>
  );
};

export default ResultsPage;