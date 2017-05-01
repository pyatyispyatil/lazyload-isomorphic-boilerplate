import express  from 'express';
import React    from 'react';
import {applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'

import {markup, renderHTML} from './../server/render';
import * as page from './../actions/pageActions';
import rootSaga from './../sagas';

import configureStore from '../stores/configureStore';


require('source-map-support').install({
  handleUncaughtExceptions: false,
  environment: 'node'
});


const app = express();

app.use('/static', express.static('build/client'));

app.get(/^(?:(?!\/?static|\/?api)(?:.*))$/, (req, res) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({}, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(rootSaga);

  const unsubscribe = store.subscribe(() => {
    const state = store.getState();

    if (state.page.loading === false) {
      const context = {};

      const html = markup(req.path, context, store);

      if (context.url) {
        res.writeHead(301, {
          Location: context.url
        });
        res.end()
      } else {
        res.write(renderHTML(html, state));
        res.end();
      }

      unsubscribe();
    }
  });

  store.dispatch({
    type: page.actions.START_LOADING,
    payload: {
      path: req.path
    }
  });
});

app.get('/api/catalog', (req, res) => {
  res.write(JSON.stringify([{
    label: 'test_1',
    id: 1
  }, {
    label: 'test_2',
    id: 2
  }, {
    label: 'test_3',
    id: 3
  }]));
  res.end();
});

app.get('/api/vote', (req, res) => {
  res.write(JSON.stringify({
    rating: req.query.id*4,
    id: +req.query.id
  }));
  res.end();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
});
