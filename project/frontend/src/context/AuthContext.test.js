import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { auth } from '../firebaseConfig';

jest.mock('../firebaseConfig', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
  },
}));


const MockChildComponent = () => {
  const { currentUser } = useAuth();
  return (
    <div>
      <p data-testid="user">
        {currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in'}
      </p>
    </div>
  );
};

describe('AuthProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when loading is false', async () => {
    auth.onAuthStateChanged.mockImplementationOnce((callback) => {
      callback(null); 
      return () => {};
    });

    render(
      <AuthProvider>
        <MockChildComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument()
    });
  });

  test('sets currentUser correctly when user is logged in', async () => {
    const mockUser = { email: 'test@example.com' };
    auth.onAuthStateChanged.mockImplementationOnce((callback) => {
      callback(mockUser); 
      return () => {};
    });

    render(
      <AuthProvider>
        <MockChildComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(`Logged in as ${mockUser.email}`)
      ).toBeInTheDocument()
    });
  });

  test('does not render children while loading', () => {
    auth.onAuthStateChanged.mockImplementationOnce(() => {
      
      return () => {};
    });

    const { container } = render(
      <AuthProvider>
        <MockChildComponent />
      </AuthProvider>
    );


    expect(container).toBeEmptyDOMElement();
  });
});
