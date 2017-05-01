import {put, takeEvery, fork, call, all} from 'redux-saga/effects';
import * as page from './../actions/pageActions';
import * as catalog from './../actions/catalogActions';
import * as vote from './../actions/voteActions';
import api from './../api/api';

import routes from './../config/routes';

export function * initPage() {
  yield [
    takeEvery(page.actions.START_LOADING, onStartLoading)
  ]
}

function * onStartLoading(action) {
  const {path, params, entryPaths} = parsePath(routes, action.payload.path);

  const forks = entryPaths
    .map((entry) => handlers[entry] ? () => call(handlers[entry]) : null)
    .concat(handlers[path] ? () => call(handlers[path], params) : [])
    .filter(Boolean);

  yield all(forks.map((handler) => handler()));

  yield call(endLoading);
}

function * endLoading() {
  yield put({type: page.actions.END_LOADING});
}

const handlers = {
  'catalog': function * loadCatalog(params) {
    try {
      const data = yield api.catalog.get();

      yield put({type: catalog.actions.RESET});
      yield put({type: catalog.actions.ADD, payload: {items: data}});
    } catch (error) {
      console.log(error);
    }
  },
  'vote': function * loadVote(params) {
    try {
      const data = yield api.catalog.vote({id: parseInt(params.item)});

      yield put({type: vote.actions.SET, payload: data});
    } catch (error) {
      console.log(error);
    }
  }
};


//ToDo: refactoring
function parsePath(routes, fullPath) {
  const splitedPath = ['/'].concat(fullPath.split('/').filter(Boolean));

  const {path, params, entryPaths} = splitedPath.reduce((result, path) => {
    const route = result.route.children ? (
      result.route.children.find((route) => route.path.indexOf(path) === 0)
    ) : null;

    if (route) {
      return {
        route,
        entryPaths: [...result.entryPaths, path],
        path
      };
    } else {
      const query = result.query || result.route.path.split('/:').splice(1);
      const currentParam = query.shift();

      return {
        ...result,
        query,
        params: {
          ...(result.params || {}),
          [currentParam]: path
        }
      }
    }
  }, {
    route: {children: routes},
    entryPaths: []
  });

  return {
    path,
    params: params || {},
    entryPaths: entryPaths.slice(0, -1)
  };
}
