import {applyMiddleware, compose} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import history from './history';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

export default composeEnhancers(
  applyMiddleware(routerMiddleware(history)),
);
