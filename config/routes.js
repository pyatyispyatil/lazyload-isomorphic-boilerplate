import App from '../layouts/App';
import Catalog from '../layouts/Catalog';

export default [
  {
    path: '',
    component: App,
    children: [
      {
        path: 'catalog',
        component: Catalog,
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