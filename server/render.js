import React from 'react';
import ReactDOM from 'react-dom/server';
import {Route, Redirect, StaticRouter} from 'react-router';

import routes from './routes';

export const RedirectWithStatus = ({ from, to, status }) => (
  <Route render={({ staticContext }) => {
    // there is no `staticContext` on the client, so
    // we need to guard against that here
    if (staticContext) {
      staticContext.status = status;
    }

    return <Redirect from={from} to={to}/>
  }}/>
);


export const markup = (url, context) => ReactDOM.renderToString(
  <StaticRouter
    location={url}
    context={context}
  >
    {routes}
  </StaticRouter>
);

const assetUrl = (!process.argv.includes('prod') ? 'http://localhost:8080' : '') + '/static/index.js';

console.log(assetUrl);

export function renderHTML(componentHTML) {
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
        <script src="${assetUrl}" defer></script>
      </body>
    </html>
  `;
}