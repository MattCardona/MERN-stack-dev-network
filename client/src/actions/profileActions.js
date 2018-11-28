import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS} from './types.js';
import { logoutUser } from './authActions.js';
// get current user profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios.get('/api/profile')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    )
}

// create a Profile
export const createProfile = (profileData, history) => dispatch => {
  axios.post('/api/profile', profileData)
    .then(res => history.push('/dashboard'))
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

// profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}

// clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}

export const addExperience = (expData, history) => dispatch => {
  axios.post('/api/profile/experience', expData)
    .then(res => history.push('/dashboard'))
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

// delete account and the profile
export const deleteAccount = () => dispatch => {
  if(window.confirm('Are you sure? This can not be undone!')){
    axios.delete('/api/profile')
      .then(res => {
        dispatch(logoutUser());
      })
      .catch(e =>
        dispatch({
          type: GET_ERRORS,
          payload: e.response.data
        })
      )
  }
}