import axios from 'axios';
import api_base_url from './apiConfig';

const user_api_url = `${api_base_url}/api/users`;

export const registerUser = async(userData, token) => {
  console.log("token", token)
  try {
    const response = await axios.post(user_api_url, userData,
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
    console.error('Error registering user:', error.response?.data || error.message);
    throw new Error('Failed to register user');
  }
};