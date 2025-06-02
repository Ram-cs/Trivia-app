import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchCategories, setSelectedCategory, setDifficulty, setAmount, Category } from '../features/quiz/quizSlice';
import { useNavigate } from 'react-router-dom';

const CategorySelector = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories, selectedCategory, selectedDifficulty, amount, status } = useAppSelector(state => state.quiz);

  useEffect(() => {
    if (categories.length === 0 && status !== 'loading') {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, status]);

  return (
    <div className="w-full flex flex-col items-center mt-16">
      <h2 className="text-3xl font-bold text-center mb-10 tracking-tight">QUIZ MAKER</h2>
      {status === 'loading' && (
        <div className="flex flex-col items-center mb-6">
          <svg className="animate-spin h-6 w-6 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-gray-500 text-lg">Loading categories...</span>
        </div>
      )}
      {status === 'failed' && (
        <div className="mb-6">
          <span className="text-red-500 text-lg font-medium">Error loading categories.</span>
        </div>
      )}
      <div className="flex flex-row items-center w-full max-w-4xl border border-gray-300 rounded-xl overflow-hidden bg-white">
        <select
          value={selectedCategory || ''}
          onChange={e => dispatch(setSelectedCategory(Number(e.target.value)))}
          className="flex-1 px-6 py-4 text-xl border-none outline-none bg-white focus:ring-0"
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat: Category) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={selectedDifficulty}
          onChange={e => dispatch(setDifficulty(e.target.value))}
          className="flex-1 px-6 py-4 text-xl border-none outline-none bg-white border-l border-gray-300 focus:ring-0"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input
          type="number"
          min="1"
          max="50"
          value={amount}
          onChange={e => dispatch(setAmount(Number(e.target.value)))}
          className="flex-1 px-6 py-4 text-xl border-none outline-none bg-white border-l border-gray-300 focus:ring-0"
          placeholder="Number of questions"
        />
        <button
          disabled={!selectedCategory}
          onClick={() => navigate('/quiz')}
          className="px-8 py-4 text-xl font-medium border-none bg-white border-l border-gray-300 text-gray-500 hover:text-gray-700 transition disabled:cursor-not-allowed"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CategorySelector;