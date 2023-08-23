const axios = require('axios');

async function get(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}

function getErrorMessage(error) {
  if (error.response) {
    return `API responded with status ${error.response.status}`;
  } else if (error.request) {
    return 'No response from the server';
  } else {
    return 'An error occurred while making the request';
  }
}

module.exports = {
  get,
};
