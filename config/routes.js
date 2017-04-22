import App from './../components/app';

export default [
  {
    path: '',
    component: App,
    children: [
      {
        path: 'page1',
        component: App,
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