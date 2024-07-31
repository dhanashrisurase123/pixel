import axios from 'axios';

const API_URL = 'https://dummyjson.com/users';

const getUsers = (page = 1, limit = 10) => {
  return axios.get(`${API_URL}?limit=${limit}&skip=${(page - 1) * limit}`)
    .then(response => response.data.users)
    .catch(error => {
      console.error('There was an error fetching the user data!', error);
      throw error;
    });
};

export default {
  getUsers,
};
