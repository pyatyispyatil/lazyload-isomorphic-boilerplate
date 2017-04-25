import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Route, Router} from 'react-router';
import {Provider} from 'react-redux';

import history from './history';

import routes from './../config/routes';

import store from './stores/store';

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
              ((Module) => (<Module {...props}>{makeRoutes(children, `${parentPath}${path}/`)}</Module>))(module)
            ) : (
              null
            )}
          </Loader>
        ) : (
          ((Component) => (<Component {...props}>{makeRoutes(children, `${parentPath}${path}/`)}</Component>))(component)
        )
      }
    />
  ))
}

function checkPathNesting(pattern, path) {
  return pattern.indexOf(pattern.indexOf('/') > -1 ? path + '/' : path) === 0
}

function getLazyRoutes(routes, fullPath) {
  const initPath = fullPath.split('/').filter(Boolean);
  const lazyRoutes = [];

  initPath.unshift('');

  initPath.reduce((children, path) => {
    const currentRoute = children.find((child) => checkPathNesting(child.path, path));

    if (currentRoute.lazy) {
      lazyRoutes.push(currentRoute);
    }

    return currentRoute.children;
  }, routes);

  return lazyRoutes;
}

function loadLazyRoutes(lazyRoutes, cb) {
  lazyRoutes.forEach((route) => {
    route.component((module) => {
      route.lazy = false;
      route.component = module.default;

      if (lazyRoutes.every((route) => !route.lazy)) {
        cb();
      }
    })
  })
}

const lazyRoutes = getLazyRoutes(routes, location.pathname);

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        {makeRoutes(routes)[0]}
      </Router>
    </Provider>,
    document.getElementById('react-view')
  );
}

if (lazyRoutes.length) {
  loadLazyRoutes(lazyRoutes, render);
} else {
  render();
}
