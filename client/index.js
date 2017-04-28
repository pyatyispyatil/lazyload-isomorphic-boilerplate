// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {Provider} from 'react-redux';

import history from './history';
import {routes} from './../config/routes';
import store from './stores/store';
import {initLazyRoutes, makeRoutes} from './utils/lazyRoutes';


function render() {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <div>
          {makeRoutes(routes)}
        </div>
      </Router>
    </Provider>,
    document.getElementById('react-view')
  );
}

initLazyRoutes(routes, window.location.pathname, render);

