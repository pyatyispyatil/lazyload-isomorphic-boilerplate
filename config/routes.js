// @flow

import App from '../layouts/App';
import Catalog from '../pages/Catalog';


export type Module = {[string]: () => any} | () => any;

type Route = {
  path: string,
  children?: Array<StaticRoute>
}

export type StaticRoute = Route & {
  component: Module,
  lazy?: false
}

export type LazyRoute = Route & {
  component: (cb: (module: Module) => void) => void,
  lazy: true
}

export type MixedRoute = LazyRoute | StaticRoute;

export const routes: Array<MixedRoute> = [
  {
    path: '',
    component: App,
    children: [
      {
        path: 'catalog',
        component: Catalog,
        lazy: true,
        children: [
          {
            path: 'page3',
            component: App
          }
        ]
      },
      {
        path: 'page2',
        component: App
      }
    ]
  }
];
