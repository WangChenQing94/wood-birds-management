
import Login from '../views/login/login'

import Layout from '../views/layout/index'

import Home from '../views/home/home';

// const Login = () => import('../views/login/login');

// const Layout = () => import('../views/layout/index');

// const Home = () => import('../views/home/home');

export const login = {
  path: '/login',
  component: Login
}

export const routes = [
  // {
  //   path: '/login',
  //   component: Login
  // },
  {
    path: '/',
    component: Layout,
    exact: true,
    routes: [
      {
        path: '/home',
        component: Home,
        exact: true
      }
    ]
  }
]