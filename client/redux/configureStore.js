import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

export default function (initialState = {}) {
  const rootReducer = combineReducers({
  });

  return createStore(rootReducer, initialState, applyMiddleware(thunk));
}