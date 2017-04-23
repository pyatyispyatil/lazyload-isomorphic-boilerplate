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
    module: null
  };

  componentWillMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    this.setState({
        module: null
      },
      () => props.load((module) => {
        this.setState({
          module: module.default ? module.default : module
        })
      })
    );
  }

  renderSpinner() {
    return <div>Loading...</div>
  }

  render() {
    return this.props.children(this.state.module) || this.renderSpinner();
  }
}

function makeRoutes(routesConfig = [], parentPath = '') {
  return routesConfig.map(({path, component, children, lazy}) => (
    <Route
      path={`${parentPath}${path}`}
      component={(props) =>
        lazy ? (
          <Loader load={component}>
            {(module) => module ? (
              module({props, children: makeRoutes(children, `${parentPath}${path}/`)})
            ) : (
              null
            )}
          </Loader>
        ) : (
          component({props, children: makeRoutes(children, `${parentPath}${path}/`)})
        )
      }
    />
  ))
}


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