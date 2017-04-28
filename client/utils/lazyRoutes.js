// @flow
import React from 'react';
import {Route} from 'react-router';

import Loader from './../components/Loader';

import type {RoutesArray, StaticRoute} from './../../config/routes';
import type {ImportedModule} from './../components/Loader';

function checkPathNesting(path: string, pattern: string): boolean {
  return pattern.indexOf(pattern.indexOf('/') > -1 ? path + '/' : path) === 0
}

function getLazyRoutes(routes: RoutesArray, fullPath: string): RoutesArray {
  const initPath: string[] = fullPath.split('/').filter(Boolean);
  const lazyRoutes: RoutesArray = [];

  initPath.unshift('');

  initPath.reduce((children: RoutesArray, path: string) => {
    const currentRoute: ?StaticRoute = children.find((child) => checkPathNesting(path, child.path));

    if (currentRoute && currentRoute.lazy) {
      lazyRoutes.push(currentRoute);
    }

    return currentRoute ? currentRoute.children || [] : [];
  }, routes);

  return lazyRoutes;
}

export function makeRoutes(routes: RoutesArray = [], parentPath: string = ''): React$Element<*>[] {
  return routes.map(({path, component, children, lazy}) =>
    <Route
      path={`${parentPath}${path}`}
      render={(props: { [string]: any }) =>
        lazy ? (
          <Loader load={component}>
            {
              (Component: ImportedModule) => Component ? (
                <Component {...props}>{makeRoutes(children, `${parentPath}${path}/`)}</Component>
              ) : (
                null
              )
            }
          </Loader>
        ) : (
          ((Component) =>
            <Component {...props}>{makeRoutes(children, `${parentPath}${path}/`)}</Component>)(component)
        )
      }
    />
  );
}

//ToDo: don't mutate the routes
export function initLazyRoutes(routes: RoutesArray, path: string, cb: () => any): void {
  Promise.all(
    getLazyRoutes(routes, path)
      .map((route: StaticRoute) => new Promise((resolve) => route.component((module) => resolve({module, route}))))
  )
    .then((data) => data.forEach(({route, module}) => {
        route.component = module.default || module;
        route.lazy = false;
      })
    )
    .then(cb);
}
