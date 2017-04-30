import * as vote from '../actions/voteActions';
import makeReducers from './../utils/makeReducers';

const initialState = {
  rating: 0
};

export default makeReducers({
  [vote.actions.INCREMENT](state, action) {
    return {
      ...state,
      rating: state.rating + 1
    };
  },
  [vote.actions.DECREMENT](state, action) {
    return {
      ...state,
      rating: state.rating - 1
    };
  },
  [vote.actions.RESET](state, action) {
    return {
      ...state,
      rating: 0
    };
  },
}, initialState);
