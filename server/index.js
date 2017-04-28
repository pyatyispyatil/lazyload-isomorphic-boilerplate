import express  from 'express';
import React    from 'react';
import configureStore from '../stores/configureStore';

import {markup, renderHTML} from './render';

require('source-map-support').install({
  handleUncaughtExceptions: false,
  environment: 'node'
});


const app = express();

app.use('/static', express.static('build/client'));

app.get(/^(?:(?!\/?static)(?:.*))$/, (req, res) => {
  const context = {};
  const store = configureStore();

  store.dispatch({type: 'INCREMENT'});

  const html = markup(req.url, context, store);

  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    });
    res.end()
  } else {
    res.write(renderHTML(html, store.getState()));
    res.end()
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
});
