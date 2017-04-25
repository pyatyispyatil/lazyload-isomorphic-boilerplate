import React from 'react';
import ReactDOM from 'react-dom/server';
import {StaticRouter} from 'react-router';
import {Provider} from 'react-redux';

import routes from './routes';

export const markup = (url, context, store) => ReactDOM.renderToString(
  <Provider store={store}>
    <StaticRouter
      location={url}
      context={context}
    >
      {routes}
    </StaticRouter>
  </Provider>
);

const assetUrl = (!process.argv.includes('prod') ? 'http://localhost:8080' : '') + '/static/index.js';

console.log('Client-side js will receive from:', assetUrl);

export function renderHTML(componentHTML = '', initialState) {
  return `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello React</title>
      </head>
      <body>
        <div id="react-view">${componentHTML}</div>
        <script type="application/javascript">
          window.REDUX_INITIAL_STATE = ${JSON.stringify(initialState)};
        </script>
        <script src="${assetUrl}" defer></script>
      </body>
    </html>
  `;
}
