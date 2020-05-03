import axios from 'axios';
import qs from 'qs';
import apiUrl, { skillAPI } from 'utils/Connection';

export async function getSkills() {
  const options = {
    method: 'GET',
    url: skillAPI.getAll,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const response = await axios(options).catch((error) => {
    console.log('error in getSkills - skill.api.js: ', error);
  });

  return response;
}
