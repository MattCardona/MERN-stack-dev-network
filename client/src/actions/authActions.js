import axios from 'axios';
import setAuthToken from '../utils/setAuthToken.js';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types.js';

//register user
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

// login user
export const loginUser = userdata => dispatch => {
  axios.post('/api/users/login', userdata)
    .then(res => {
      // save to localStorage
      const { token } = res.data;
      // set token on localStorage
      localStorage.setItem('jwtToken', token);
      // set token to Auth header
      setAuthToken(token);
      // decode the token to get user data
      const decode = jwt_decode(token);
      // set the current user
      dispatch(setCurrentUser(decode));
    })
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
};