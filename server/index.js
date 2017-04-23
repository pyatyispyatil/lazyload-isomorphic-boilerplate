import path from 'path';
import express  from 'express';
import React    from 'react';
import {RouterContext, match} from 'react-router';
import configureStore from './../client/redux/configureStore';
//import {Provider} from 'react-redux';
//import configureStore from './redux/configureStore';

import {Provider} from 'react-redux';
import routes from './routes';
import ReactDOM from 'react-dom/server';
import {markup, renderHTML} from './render';

require('source-map-support').install({
  handleUncaughtExceptions: false,
  environment: 'node'
});


const app = express();

app.use('/static', express.static('build/client'));

app.get(/^(?:(?!\/?static)(?:.*))$/, (req, res) => {
  //const store = configureStore();


  console.log(req.url);
  const context = {};

  const html = markup(req.url, context);

  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    });
    res.end()
  } else {
    res.write(renderHTML(html));
    res.end()
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
});