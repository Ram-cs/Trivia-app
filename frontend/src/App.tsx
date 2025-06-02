import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CategorySelector from './pages/CategorySelector';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CategorySelector />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
}

export default App;