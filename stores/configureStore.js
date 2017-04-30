import {combineReducers, createStore} from 'redux';
import {routerReducer} from 'react-router-redux';

import voteReducers from './../reducers/voteReducers';
import pageReducers from './../reducers/pageReducers';
import catalogReducers from './../reducers/catalogReducers';


export default function configureStore(initialState = {}, middleware) {
  const rootReducer = combineReducers({
    logger: (state = {}, action) => {
      console.log(action.type);
      return state;
    },
    vote: voteReducers,
    catalog: catalogReducers,
    page: pageReducers,
    routerReducer
  });

  return createStore(rootReducer, initialState, middleware);
}
