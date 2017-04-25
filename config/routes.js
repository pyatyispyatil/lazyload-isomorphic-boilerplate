import App from '../root/App';
import Catalog from '../pages/Catalog';
import VoteContainer from './../pages/Vote';

export default [
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
