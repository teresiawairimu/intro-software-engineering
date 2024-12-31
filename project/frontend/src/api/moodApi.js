import axios from 'axios';
import api_base_url from './apiConfig';

const mood_api_url = `${api_base_url}/api/moods`;

export const logMood = async(moodData, token) => {
  console.log("token", token)
  try {
    const response = await axios.post(mood_api_url, moodData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error logging mood:', error.response?.data || error.message);
    throw new Error('Failed to log');
  }
};

export const getMoods = async(token) => {
  const response = await axios.get(mood_api_url, 
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  console.log(response.data);
  return response.data;
}