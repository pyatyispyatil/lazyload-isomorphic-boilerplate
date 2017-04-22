//require('source-map-support').install();
import express  from 'express';
import React    from 'react';
import ReactDOM from 'react-dom/server';
import {RouterContext, match} from 'react-router';
//import {Provider} from 'react-redux';
//import configureStore from './redux/configureStore';

import {markup, renderHTML} from './render';

require('source-map-support').install({
  handleUncaughtExceptions: false,
  environment: 'node'
});


const app = express();


app.use((req, res) => {
  //const store = configureStore();

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

const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8050' : '/';


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
});