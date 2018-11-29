import axios from 'axios';
import { GET_PROFILE, GET_PROFILES, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS} from './types.js';
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

// add experince
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

// delete experience
export const deleteExperience = (expId) => dispatch => {
  axios.delete(`/api/profile/experience/${expId}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

// add education
export const addEducation = (eduData, history) => dispatch => {
  axios.post('/api/profile/education', eduData)
    .then(res => history.push('/dashboard'))
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

// delete education
export const deleteEducation = (eduId) => dispatch => {
  axios.delete(`/api/profile/education/${eduId}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

// get all profiles
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios.get('/api/profile/all')
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_PROFILES,
        payload: null
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