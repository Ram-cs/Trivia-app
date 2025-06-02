import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../src/app/store';
import QuizPage from '../src/pages/QuizPage';

test('renders Quiz page title', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <QuizPage />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText(/Quiz/i)).toBeInTheDocument();
});