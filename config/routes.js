// @flow
import App from '../root/App';
import Catalog from '../pages/Catalog';
import VoteContainer from './../pages/Vote';


export type Module = {[string]: () => any} | () => any;

export type StaticRoute = {|
  path: string,
  component: Module | (cb: (module: Module) => void) => void,
  children?: RoutesArray,
  lazy?: boolean
|}

export type RoutesArray = Array<StaticRoute>;

export const routes: RoutesArray = [
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
            path: 'vote',
            component: VoteContainer,
            lazy: true
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
