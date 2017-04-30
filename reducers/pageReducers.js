import * as page from '../actions/pageActions';
import makeReducers from './../utils/makeReducers';

const initialState = {
  path: [],
  loading: false
};

export default makeReducers({
  [page.actions.START_LOADING](state, action) {
    return {
      ...state,
      path: action.payload.path,
      loading: true
    };
  },
  [page.actions.END_LOADING](state, action) {
    return {
      ...state,
      loading: false
    };
  },
}, initialState);
