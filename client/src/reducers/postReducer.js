import { ADD_POST, GET_POSTS, POST_LOADING, DELETE_POST, LIKE_POST } from '../actions/types.js';

const intialState = {
  posts: [],
  post: {},
  loading: false
};

export default function(state = intialState, action) {
  switch(action.type){
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      }
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      }
    case POST_LOADING:
      return {
        ...state,
        loading: true
      }
    case DELETE_POST:
      return {
         ...state,
         posts: state.posts.filter(post => post._id !== action.payload)
      }
    case LIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if(post._id === action.payload._id){
            return {
              ...post,
              ...action.payload
            };
          }else{
            return post;
          }
        })
      }
    default:
      return state;
  }
}