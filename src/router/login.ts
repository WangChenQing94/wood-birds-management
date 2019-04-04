import { loadable } from './loadable';

import Login from '@/views/login/login'

export default [
  {
    path: '/login',
    component: Login
    // component: loadable('login/login')
  }
]