
import Login from '../views/login/login'

import Home from '../views/home/home';

import UserManage from '../views/userManage';
import CityManage from '../views/cityManage';
import HouseManage from '../views/houseManage';
import HomeManage from '../views/homeManage';
import ArticleManage from '../views/articleManage';

// 登录路由
export const login = {
  path: '/login',
  component: Login
}

// 所有路由
export const routes = [
  {
    path: '/home',
    component: Home,
    exact: true
  },
  {
    path: '/user-manage',
    component: UserManage,
    exact: true
  },
  {
    path: '/city-manage',
    component: CityManage,
    exact: true
  },
  {
    path: '/house-manage',
    component: HouseManage,
    exact: true
  },
  {
    path: '/home-manage',
    component: HomeManage,
    exact: true
  },
  {
    path: '/article-manage',
    component: ArticleManage,
    exact: true
  }
]