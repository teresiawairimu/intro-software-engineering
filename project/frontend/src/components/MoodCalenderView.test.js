import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MoodCalenderView from './MoodCalenderView';
import { useAuth } from '../context/AuthContext';
import { getMoods } from '../api/moodApi';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../api/moodApi', () => ({
  getMoods: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../components/NavBarComponent', () => () => <div data-testid="navbar-component">Navbar</div>);

describe('MoodCalenderView Component', () => {
  beforeAll(() => {
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ 
      currentUser: { 
        getIdToken: jest.fn().mockResolvedValue('fake-token') 
      } 
    });
  });

  test('renders the component with default state', () => {
    useAuth.mockReturnValue({ currentUser: null });
    render(
      <MemoryRouter>
        <MoodCalenderView />
      </MemoryRouter>
    );

    expect(screen.getByText('View past moods')).toBeInTheDocument();
    expect(screen.getByText('No moods logged for this date.')).toBeInTheDocument();
  });

  it('renders the NavbarComponent and calendar', async () => {
    useAuth.mockReturnValue({ 
      currentUser: { 
          getIdToken: jest.fn().mockResolvedValue('fake-token') 
      } 
    });
    getMoods.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <MoodCalenderView />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/View past moods/i)).toBeInTheDocument();
      expect(screen.getByText(/Selected Date:/i)).toBeInTheDocument();
    });
  });

  test('displays loading state while fetching moods', async () => {
    getMoods.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <MoodCalenderView />
      </MemoryRouter>
    );


    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error state when fetching moods fails', async () => {
    getMoods.mockRejectedValue(new Error('Failed to fetch moods'));

    
    render(
      <MemoryRouter>
        <MoodCalenderView />
      </MemoryRouter>
    );

    expect(await screen.findByText('Failed to retrieve moods. Please try again later')).toBeInTheDocument();
  });

  test('renders moods for the selected date', async () => {
    
    const mockMoods = [
      { createdAt: { _seconds: 1700000000 }, emoji: '😊', mood: 'Happy' },
      { createdAt: { _seconds: 1700086400 }, emoji: '😢', mood: 'Sad' },
    ];

    getMoods.mockResolvedValue(mockMoods);


    render(
      <MemoryRouter>
        <MoodCalenderView />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No moods logged for this date.')).toBeInTheDocument();
    });
    
  });
});
