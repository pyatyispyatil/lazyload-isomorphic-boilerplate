import App from '../layouts/App';
import Catalog from '../pages/Catalog';

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