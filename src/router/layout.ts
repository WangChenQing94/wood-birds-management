import Layout from '../views/layout/layout';

import Analysis from '../views/analysis/analysis';

export default [
  {
    path: '/',
    component: Layout,
    routes: [
      {
        path: '/analysis',
        component: Analysis,
        exact: true
      }
    ]
  }
]