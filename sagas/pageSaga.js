import {put, takeEvery, call} from 'redux-saga/effects';
import * as page from './../actions/pageActions';
import * as catalog from './../actions/catalogActions';
import api from './../api/api';

import routes from './../config/routes';

export function * initPage() {
  yield [
    takeEvery(page.actions.START_LOADING, onStartLoading)
  ]
}

function * onStartLoading(action) {
  const {path, params} = parsePath(routes, action.payload.path);

  console.log('startLoading:', path, params);
  if (handlers[path]) {
    yield call(handlers[path], params);
  }

  yield put({type: page.actions.END_LOADING});
}

const handlers = {
  'catalog': function * loadCatalog(params) {
    console.log('loadCatalog');
    try {
      const data = yield api.catalog.get();

      yield put({type: catalog.actions.RESET});
      yield put({type: catalog.actions.ADD, payload: {items: data}});
    } catch (error) {
      console.log(error);
    }
  }
};


//ToDo: refactoring
function parsePath(routes, path) {
  const splitedPath = ['/'].concat(path.split('/').filter(Boolean));

  const routeData = splitedPath.reduce((result, path) => {
    const route = result.routes.find((route) => route.path.indexOf(path) === 0);
    if (route) {
      return {
        routes: route && route.children ? route.children : [],
        parent: route,
        params: {},
        path
      };
    } else {
      const parentQuery = result.parentQuery ? result.parentQuery : result.parent.path.split('/:').splice(1);
      const currentParam = parentQuery.shift();

      return {
        routes: [],
        parent: result.parent,
        parentQuery: parentQuery,
        params: {...result.params, [currentParam]: path},
        path: result.path
      }
    }
  }, {
    routes
  });

  return {path: routeData.path, params: routeData.params};
}
