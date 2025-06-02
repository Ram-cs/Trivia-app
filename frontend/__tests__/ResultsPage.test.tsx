import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../src/app/store';
import ResultsPage from '../src/pages/ResultsPage';

test('renders Results page title', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ResultsPage />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText(/Results/i)).toBeInTheDocument();
});