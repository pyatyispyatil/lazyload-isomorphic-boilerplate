// @flow
import App from '../root/App';
import Catalog from '../pages/Catalog';
import VoteContainer from './../pages/Vote';


type LazyRoute = {|
  path: string,
  component: React$Element<*>,
  children?: RoutesArray,
  lazy?: false
|}

type NormalRoute = {|
  path: string,
  component: (module: { [mixed]: React$Component<*, *, *> }) => void,
  children?: RoutesArray,
  lazy: true
|}

export type StaticRoute = NormalRoute | LazyRoute;

export type RoutesArray = StaticRoute[];

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
