import React from 'react';
import {Route} from 'react-router';
import {routes} from './../config/routes';

function makeRoutes(routesConfig = [], parentPath = '') {
  return routesConfig.map(({path, component, children}) => (
    <Route
      path={`${parentPath}${path}`}
      component={(...props) =>
        ((Component) => <Component {...props}>{makeRoutes(children, `${parentPath}${path}/`)}</Component>)(component)
      }
    />
  ))
}

export default makeRoutes(routes);
