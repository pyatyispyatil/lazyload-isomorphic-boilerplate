import React from 'react';
import {Route} from 'react-router';
import routes from './../config/routes';

const metaRoute = (path, component) => ({match}) => (
  <Route path={`${match.url}/${path}`} component={component}/>
);

function makeRoutes(routesConfig = [], parentPath = '') {
  return routesConfig.map(({path, component, children}) => (
    <Route
      path={`${parentPath}${path}`}
      component={(...props) =>
        component({...props, children: makeRoutes(children, `${parentPath}${path}/`)})
      }
    />
  ))
}

export default <div>{makeRoutes(routes)}</div>;