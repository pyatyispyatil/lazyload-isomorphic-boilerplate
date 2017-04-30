import {select, takeEvery} from 'redux-saga/effects';

import {markup, renderHTML} from './../server/render';
import * as page from './../actions/pageActions';

export function * serverWatcher() {
  yield [
    takeEvery(page.actions.END_LOADING, onPageLoadingComplete)
  ]
}

const getPath = (store) => store.page.path;

function * onPageLoadingComplete(action) {
  const context = {};
  const {res} = action.payload;

  const path = yield select(getPath);

  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    });
    res.end()
  } else {
    const store = yield select();
    const html = markup(path, context, store);

    res.write(renderHTML(html, store));
    res.end();
  }
}
