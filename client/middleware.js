import {applyMiddleware, compose} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import history from './history';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

export default composeEnhancers(
  applyMiddleware(routerMiddleware(history)),
  // other store enhancers if any
);
