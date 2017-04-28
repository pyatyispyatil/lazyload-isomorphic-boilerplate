import {combineReducers, createStore} from 'redux';
import {routerReducer} from 'react-router-redux';
import voteReducer from './../reducers/voteReducers';

export default function configureStore(initialState = {}, middleware) {
  const rootReducer = combineReducers({
    vote: voteReducer,
    routerReducer
  });

  return createStore(rootReducer, initialState, middleware);
}
