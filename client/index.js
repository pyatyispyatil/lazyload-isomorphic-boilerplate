import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';

import routes from './../config/routes';

function lazyLoadComponent(lazyModule, field = "default") {
  return (location, cb) => {
    lazyModule((module) => cb(null, module[field]));
  }
}

class Loader extends Component {
  state = {
    loaded: false,
    component: null
  };

  componentDidMount() {
    this.props.component((module) =>
      this.setState({component: module.default, loaded: true})
    );
  }

  render() {
    return this.state.loaded ? (
      this.state.component({
        ...this.props.routeProps,
        children: makeRoutes(this.props.routeChildren, this.props.path)
      })
    ) : (
      <div>...loading</div>
    )
  }
}

function makeRoutes(routesConfig = [], parentPath = '') {
  return routesConfig.map(({path, component, children, lazy}) => (
    <Route
      path={`${parentPath}${path}`}
      component={(props) =>
        lazy ? (
          <Loader
            routeProps={props}
            component={component}
            routeChildren={children}
            path={`${parentPath}${path}/`}
          />
        ) : (
          component({props, children: makeRoutes(children, `${parentPath}${path}/`)})
        )
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


const initLazyRoutes = [];
const initPath = location.pathname.split('/').filter(Boolean);
initPath.unshift('');

if (initPath.length) {
  initPath.reduce((route, path) => {
    const currentRoute = (Array.isArray(route) ? route : route.children)
      .find((child) => child.path === path);

    if (currentRoute && currentRoute.lazy) {
      initLazyRoutes.push(currentRoute);
    }

    return currentRoute;
  }, routes);
}

if (initLazyRoutes.length) {
  initLazyRoutes.forEach((route) => {
    route.component((module) => {
      route.lazy = false;
      route.component = module.default;

      if (initLazyRoutes.every((route) => !route.lazy)) {
        render();
      }
    })
  })
} else {
  render();
}

function render() {
  ReactDOM.render(
    <BrowserRouter
      basename={'/'}
      forceRefresh={false}
    >
      {makeRoutes(routes)[0]}
    </BrowserRouter>,
    document.getElementById('react-view')
  );
}