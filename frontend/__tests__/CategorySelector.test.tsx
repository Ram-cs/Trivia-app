import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from '@jest/globals';
import store from '../src/app/store';
import CategorySelector from '../src/pages/CategorySelector';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

describe('CategorySelector', () => {
  test('renders category selector page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CategorySelector />
        </BrowserRouter>
      </Provider>
    );

    // Check for the heading
    const heading = screen.getByText('QUIZ MAKER');
    expect(heading).toBeTruthy();
    
    // Check for the category select dropdown
    const categorySelect = screen.getByText('Select a category');
    expect(categorySelect).toBeTruthy();
    
    // Check for difficulty options
    const easyOption = screen.getByText('Easy');
    const mediumOption = screen.getByText('Medium');
    const hardOption = screen.getByText('Hard');
    expect(easyOption).toBeTruthy();
    expect(mediumOption).toBeTruthy();
    expect(hardOption).toBeTruthy();
    
    // Check for the Create button
    const createButton = screen.getByText('Create');
    expect(createButton).toBeTruthy();
  });
});
