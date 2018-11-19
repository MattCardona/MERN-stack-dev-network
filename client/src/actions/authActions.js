import { TEST_DISPATCH } from './types.js';

export const registerUser = (userdata) => {
  return {
    type: TEST_DISPATCH,
    payload: userdata
  };
};