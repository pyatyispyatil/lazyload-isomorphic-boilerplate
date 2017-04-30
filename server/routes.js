import React from 'react';
import {Route} from 'react-router';
import staticRoutes from './../config/routes';

function makeRoutes(routesConfig = [], parentPath = '') {
  return routesConfig.map(({path, component, children}) => (
    <Route
      path={`${parentPath}${path}`}
      component={(...props) =>
        ((Component) =>
            <Component {...props}>
              {makeRoutes(children, `${parentPath}${path}${parentPath ? '/' : ''}`)}
            </Component>)(component)
      }
    />
  ))
}

export const routes = makeRoutes(staticRoutes);
