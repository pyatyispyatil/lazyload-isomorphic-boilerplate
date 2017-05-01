import axios from 'axios';

let API_SERVER = 'http://localhost:3001/api';

const whoiam = process.env.WHO_I_AM;

const makeRequest = (url, type = 'post') => (data) => new Promise((resolve, reject) =>
  axios({
    method: type,
    baseURL: API_SERVER,
    url: url,
    data: type === 'get' ? {} : data,
    params: type === 'get' ? data : {},
    dataType: 'json',
    responseType: 'json'
  })
    .then(({data}) => resolve(data))
    .catch((error) => reject(error))
);

export default {
  catalog: {
    get: makeRequest('/catalog', 'get'),
    vote: makeRequest('/vote', 'get')
  }
};
