import axios from 'axios';
import { ADD_POST, GET_ERRORS, GET_POSTS, POST_LOADING, DELETE_POST } from './types.js';

// add a post
export const addPost = postData => dispatch => {
  axios.post('/api/posts', postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
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

// get post
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios.get('/api/posts')
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    )
}

// delete post
export const deletePost = id => dispatch => {
  axios.delete(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

//  Add like to a post
export const addLike = id => dispatch => {
  axios.post(`/api/posts/like/${id}`)
    .then(res =>
      dispatch(getPosts())
    )
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

// set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  }
}