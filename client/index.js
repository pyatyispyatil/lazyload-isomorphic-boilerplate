import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {Provider} from 'react-redux';

import history from './history';
import routes from './../config/routes';
import store from './stores/store';
import * as page from './../actions/pageActions';
import {initLazyRoutes, makeRoutes} from './utils/lazyRoutes';

history.listen(({pathname}) => store.dispatch({
  type: page.actions.START_LOADING,
  payload: {
    path: pathname
  }
}));

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

