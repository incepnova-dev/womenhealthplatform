import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock react-router-dom to avoid requiring the real package in Jest
jest.mock('react-router-dom', () => ({
  __esModule: true,
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <>{element}</>,
  Link: ({ children, to, ...rest }) => <a href={typeof to === 'string' ? to : '#'} {...rest}>{children}</a>,
}), { virtual: true });

// Mock axios globally for this test to avoid ESM issues from node_modules
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
    })),
  },
}));

test('App renders without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});
