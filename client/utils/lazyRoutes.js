import React from 'react';
import {Route} from 'react-router';

import Loader from './../components/Loader';


function checkPathNesting(path, pattern) {
  return pattern.indexOf(pattern.indexOf('/') > -1 ? path + '/' : path) === 0
}

function getLazyRoutes(routes, fullPath) {
  const initPath = fullPath.split('/').filter(Boolean);
  const lazyRoutes = [];

  initPath.unshift('');

  initPath.reduce((children, path) => {
    const currentRoute = children.find((child) => checkPathNesting(path, child.path));

    if (currentRoute.lazy) {
      lazyRoutes.push(currentRoute);
    }

    return currentRoute.children;
  }, routes);

  return lazyRoutes;
}

export function makeRoutes(routes = [], parentPath = '') {
  return routes.map(({path, component, children, lazy}) => (
    <Route
      path={`${parentPath}${path}`}
      component={(props) =>
        lazy ? (
          <Loader load={component}>
            {(module) => module ? (
              ((Module) => (<Module {...props}>{makeRoutes(children, `${parentPath}${path}/`)}</Module>))(module)
            ) : (
              null
            )}
          </Loader>
        ) : (
          ((Component) => (
            <Component {...props}>{makeRoutes(children, `${parentPath}${path}/`)}</Component>))(component)
        )
      }
    />
  ))
}

export function initLazyRoutes(routes, path, cb) {
  Promise.all(
    getLazyRoutes(routes, path)
      .map((route) => new Promise((resolve) => route.component(resolve)))
    )
    .then((modules) => {
      routes.forEach((route, index) => {
        route.component = modules[index].default;
        route.lazy = false;
      })
    })
    .then(cb);
}
