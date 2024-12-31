import axios from 'axios';
import { logMood, getMoods } from './moodApi';


jest.mock('axios');

describe('API Functions', () => {
  const mood_api_url = "http://localhost:5000/api/moods";
  const mockToken = 'mocked-token';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logMood', () => {
    it('should post mood data with the correct headers', async () => {
      const mockMoodData = { mood: 'happy' };
      const mockResponse = { data: { success: true } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await logMood(mockMoodData, mockToken);

      expect(axios.post).toHaveBeenCalledWith(
        mood_api_url,
        mockMoodData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          withCredentials: true,
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors and throw a new error', async () => {
      const mockError = {
        response: { data: 'Error logging mood' },
      };
      axios.post.mockRejectedValueOnce(mockError);

      await expect(logMood({ mood: 'sad' }, mockToken)).rejects.toThrow(
        'Failed to log'
      );
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMoods', () => {
    it('should fetch moods with the correct headers', async () => {
      const mockResponse = { data: [{ mood: 'happy' }, { mood: 'sad' }] };
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await getMoods(mockToken);

      expect(axios.get).toHaveBeenCalledWith(mood_api_url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        withCredentials: true,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if the request fails', async () => {
      const mockError = {
        response: { data: 'Error fetching moods' },
      };
      axios.get.mockRejectedValueOnce(mockError);

      await expect(getMoods(mockToken)).rejects.toThrow();
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});


