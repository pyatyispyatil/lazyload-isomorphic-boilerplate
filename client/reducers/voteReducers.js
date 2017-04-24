import * as vote from '../actions/voteActions'
const initialState = {

  rating: 0
};

export default function voteReducers(state = initialState, action) {
  console.log('voteReducers:', action.type);
  switch (action.type) {
    case vote.action.INCREMENT: {
      return vote.increment(state);
    }
    case vote.action.DECREMENT: {
      return vote.decrement(state);
    }
    case vote.action.RESET: {
      return vote.reset(state);
    }
    default:
      return state;
  }
}
