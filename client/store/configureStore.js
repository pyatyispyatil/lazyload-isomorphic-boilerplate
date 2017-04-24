import {applyMiddleware, combineReducers, createStore, compose} from 'redux';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import voteReducer from './../reducers/voteReducers';
import thunk from 'redux-thunk';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(routerMiddleware),
  // other store enhancers if any
);

const routerTemp = routerReducer;

const router = (...args) => {
  console.log('routerReducer:', ...args);
  return routerTemp(...args);
};

export function configureStore(initialState = {}) {
  const rootReducer = combineReducers({
    vote: voteReducer,
    routerReducer: router
  });

  return createStore(rootReducer, initialState, enhancer);
}

export const store = configureStore();
