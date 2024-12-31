import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import App from './App';
import ProtectedRoute from '../route/ProtectedRoute';
import { vi } from 'vitest';

jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    isAuthenticated: true, 
  }),
}));

jest.mock('./route/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="protected">{children}</div>,
}));

jest.mock('./components/AuthForm', () => () => <div data-testid="auth-form">AuthForm Component</div>);
jest.mock('./pages/DashboardPage', () => () => <div data-testid="dashboard">Dashboard Page</div>);
jest.mock('./components/MoodCalenderView', () => () => <div data-testid="calender-view">Mood Calendar View</div>);

describe('App Component', () => {
  test('renders AuthForm at the root path', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });

  test('renders DashboardPage for /dashboard route when authenticated', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    window.history.pushState({}, 'Dashboard', '/dashboard'); 
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  test('renders MoodCalenderView for /calender-view route when authenticated', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    window.history.pushState({}, 'Calendar View', '/calender-view'); 
    expect(screen.getByTestId('calender-view')).toBeInTheDocument();
  });

  test('does not render protected route if not authenticated', () => {
    jest.mock('./context/AuthContext', () => ({
      AuthProvider: ({ children }) => <div>{children}</div>,
      useAuth: () => ({
        isAuthenticated: false,
      }),
    }));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    window.history.pushState({}, 'Dashboard', '/dashboard'); // Navigate to /dashboard
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });
});

