import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import {} from 'react-router-redux';
import {Provider} from 'react-redux';

import routes from './../config/routes';

import {store} from './store/configureStore';

window.store = store;

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
          component({props, children: makeRoutes(children, `${parentPath}${path}/`)})
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
      <BrowserRouter
        basename={'/'}
        forceRefresh={false}
      >
        {makeRoutes(routes)[0]}
      </BrowserRouter>
    </Provider>,
    document.getElementById('react-view')
  );
}

if (lazyRoutes.length) {
  loadLazyRoutes(lazyRoutes, render);
} else {
  render();
}
