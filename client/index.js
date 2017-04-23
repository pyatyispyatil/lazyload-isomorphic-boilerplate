// @flow

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';

import type {MixedRoute, Module} from './../config/routes';
import {routes} from './../config/routes';

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

function checkPathNesting(pattern, path) {
  return pattern.indexOf(pattern.indexOf('/') > -1 ? path + '/' : path) === 0
}

function getLazyRoutes(routes: Array<MixedRoute>, fullPath: string) {
  const initPath: Array<string> = fullPath.split('/').filter(Boolean);
  const lazyRoutes: Array<MixedRoute> = [];

  initPath.unshift('');

  initPath.reduce((children, path) => {
    const currentRoute = children.find((child) => checkPathNesting(child.path, path));

    if (currentRoute) {
      if (currentRoute.lazy) {
        lazyRoutes.push(currentRoute);
      }

      return currentRoute.children || [];
    } else {
      return [];
    }
  }, routes);

  return lazyRoutes;
}


function loadLazyRoutes(lazyRoutes: Array<MixedRoute>, cb: () => any) {
  lazyRoutes.forEach((route: MixedRoute) => {
    route.component((module: Module) => {
      route.lazy = false;
      route.component = module.default;

      if (lazyRoutes.every((route: MixedRoute) => !route.lazy)) {
        cb();
      }
    })
  })
}

const lazyRoutes: Array<MixedRoute> = getLazyRoutes(routes, location.pathname);

if (lazyRoutes.length) {
  loadLazyRoutes(lazyRoutes, render);
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
