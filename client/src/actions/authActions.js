import axios from 'axios';

import { GET_ERRORS } from './types.js';

export const registerUser = (userdata, history) => dispatch => {
  axios.post('/api/users/register', userdata)
      .then(res => history.push('/login'))
      .catch(e =>
        dispatch({
          type: GET_ERRORS,
          payload: e.response.data
        })
      )
};