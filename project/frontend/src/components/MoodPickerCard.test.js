import React from 'react';
import { render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import MoodPickerCard from './MoodPickerCard';
import { logMood } from '../api/moodApi';
import { useAuth } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../api/moodApi', () => ({
  logMood: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@emoji-mart/react', () => {
  return function MockPicker({ onEmojiSelect }) {
    return (
      <div>
        <button 
          onClick={() => onEmojiSelect({ native: '😊' })} 
          aria-label="😊"
        >
          😊
        </button>
      </div>
    );
  };
});

describe('MoodPickerCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the MoodPickerCard component', () => {
    useAuth.mockReturnValue({ currentUser: { getIdToken: jest.fn() } });

    render(
      <BrowserRouter>
        <MoodPickerCard />
      </BrowserRouter>
    );

    expect(screen.getByText('Daily Mood Check-in')).toBeInTheDocument();
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument();
    expect(screen.getByText('Log Mood')).toBeDisabled();
    expect(screen.getByText('View Calender')).toBeInTheDocument();
  });

  test('enables Log Mood button after selecting an emoji', async () => {
    useAuth.mockReturnValue({ currentUser: { getIdToken: jest.fn() } });

    render(
      <BrowserRouter>
        <MoodPickerCard />
      </BrowserRouter>
    );

    const emoji = screen.getByRole('button', { name: /😊/ });
    fireEvent.click(emoji);

    await waitFor(() => {
      expect(screen.getByText('Log Mood')).not.toBeDisabled();
    });
  })

  test('logs the mood successfully', async () => {
    const getIdTokenMock = jest.fn().mockResolvedValue('mock-token');
    useAuth.mockReturnValue({ currentUser: { getIdToken: getIdTokenMock } });

    logMood.mockResolvedValue({});

    render(
      <BrowserRouter>
        <MoodPickerCard />
      </BrowserRouter>
    );


    const emoji = screen.getByRole('button', { name: /😊/ });
    await act(async () => {
      fireEvent.click(emoji);
    });

    const logMoodButton = screen.getByText('Log Mood');
    await act(async () => {
      fireEvent.click(logMoodButton);
    });

    await waitFor(() => {
      expect(logMood).toHaveBeenCalledWith(
      { emoji: '😊', mood: 'Happy' },
      'mock-token'
    );
  });
    expect(await screen.findByText('You are feeling Happy today!')).toBeInTheDocument();
  });

  test('displays an error message if logging mood fails', async () => {
    const getIdTokenMock = jest.fn().mockResolvedValue('mock-token');
    useAuth.mockReturnValue({ currentUser: { getIdToken: getIdTokenMock } });

    logMood.mockRejectedValue(new Error('Failed to log mood'));

    render(
      <BrowserRouter>
        <MoodPickerCard />
      </BrowserRouter>
    );


    const emoji = screen.getByRole('button', { name: /😊/ });
    fireEvent.click(emoji);

    const logMoodButton = screen.getByText('Log Mood');
    fireEvent.click(logMoodButton);

    expect(await screen.findByText("Sorry, couldn't capture your mood today.")).toBeInTheDocument();
  });
});
