import * as catalog from '../actions/catalogActions';
import makeReducers from './../utils/makeReducers';

const initialState = {
  items: []
};

export default  makeReducers({
  [catalog.actions.ADD](state, action) {
    return {
      ...state,
      items: state.items.concat(action.payload.items)
    };
  },
  [catalog.actions.REMOVE](state, action) {
    return {
      ...state,
      items: state.items.filter((field) => field.id === action.payload.itemId)
    };
  },
  [catalog.actions.RESET](state, action) {
    return {...initialState};
  }
}, initialState);
