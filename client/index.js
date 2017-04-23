import React from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';

import routes from './../config/routes';

function lazyLoadComponent(lazyModule, field = "default") {
  return (location, cb) => {
    lazyModule((module) => cb(null, module[field]));
  }
}

//
// if (initPath.length) {
//   initPath.reduce((route, path) => {
//     const currentRoute = route.children.find((child) => child.path === path);
//     return currentRoute;
//   }, routes);
// }

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
//
// function makeRoutes(routesConfig = [], parentPath = '') {
//   return routesConfig.map(({path, component, children}) => (
//     parentPath ? (
//       <Route
//         path={`${parentPath}${path}`}
//         getComponent={(location, cb) =>
//           component((module) =>
//             cb(null, (...props) =>
//               module.default({
//                 ...props,
//                 children: makeRoutes(children, `${parentPath}${path}/`)
//               })
//             )
//           )
//         }
//       />
//     ) : (
//       <Route
//         path={`${parentPath}${path}`}
//         component={(...props) =>
//           component({...props, children: makeRoutes(children, `${parentPath}${path}/`)})
//         }
//       />
//     )
//   ))
// }

ReactDOM.render(
  <BrowserRouter
    basename={'/'}
    forceRefresh={false}
  >
    {makeRoutes(routes)[0]}
  </BrowserRouter>,
  document.getElementById('react-view')
);