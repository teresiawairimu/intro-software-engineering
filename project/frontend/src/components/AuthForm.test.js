/**
 * @jest-environment jsdom
 */


import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from '@testing-library/react';
import AuthForm from './AuthForm';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebaseConfig';
import { registerUser } from '../api/userApi';


jest.mock('../firebaseConfig', () => ({
  auth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: {getIdToken: jest.fn().mockResolvedValue('fake-token')}
  }),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { email: 'test@example.com'},
  }),
}));


jest.mock('../api/userApi', () => ({
  registerUser: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('AuthForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Login form by default', async() => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthForm />
        </BrowserRouter>
      );
    })
      
    expect(screen.getByRole('button', {name: 'Switch to Login Form'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Switch to Sign Up Form'})).toBeInTheDocument();
  });

  test('switches to Sign Up form when Sign Up button is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthForm />
        </BrowserRouter>
      );
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Switch to Sign Up Form'}));
    })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    })
   
  });

  test('submits Login form', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthForm />
        </BrowserRouter>
      );
    })
    
  
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter email'), {
        target: { value: 'test@example.com' },
      });
    })

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit Login Form' }));
    })
  
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
    });
  })

  test('validates email and password on form submission', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthForm />
        </BrowserRouter>
      );
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Switch to Sign Up Form'}));
    })


    await act( async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Submit Sign Up Form'}));
    })
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    })
    
  });

  test('calls Firebase signInWithEmailAndPassword on login', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthForm />
        </BrowserRouter>
      );
    })

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter email'), {
        target: { value: 'test@example.com' },
      });
    })
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });
    })
    
    await act (async() => {
      fireEvent.submit(screen.getByRole('button', {name: 'Submit Login Form'}));
    })
          
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
    })
    
  });

  test('calls Firebase createUserWithEmailAndPassword and registerUser on sign up', async () => {
    const mockGetIdToken = jest.fn().mockResolvedValue('fake-token');
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { getIdToken: mockGetIdToken }
    });
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthForm />
        </BrowserRouter>
      );
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Switch to Sign Up Form'}));
    });
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter name'), {
        target: { value: 'Test User' },
      });
    })
    await act(async() => {
      fireEvent.change(screen.getByPlaceholderText('Enter email'), {
        target: { value: 'test@example.com' },
      });
    })
    await act(async() => {
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', {name: 'Submit Sign Up Form'}));
    })
 
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
    }); 
    
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith(
        { name: 'Test User', email: 'test@example.com' },
        'fake-token'
      );
    }) 
  })

  test('displays error message on failed login', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Invalid credentials'));
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthForm />
        </BrowserRouter>
      );
    })

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter email'), {
        target: { value: 'test@example.com' },
      });
    })
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'wrongpassword' },
      });
    })
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', {name: 'Submit Login Form'}));
    })

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });
})