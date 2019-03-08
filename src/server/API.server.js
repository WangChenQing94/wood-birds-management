// 接口服务的类函数

// 引入axios  类似ajax,原理使用的是Promise
import {
  message
} from 'antd';
import axios from 'axios';
import API from './API.config';

// 允许请求时携带跨域凭证
axios.defaults.withCredentials = true;

// 定义接口Http类
class Http {
  constructor() {
    this.home = {
      getCityList: this.get.bind(this, API.home.getCityList),
      addCity: this.post.bind(this, API.home.addCity),
      deleteCity: this.post.bind(this, API.home.deleteCity),
      uploadCityPicture: API.home.uploadCityPicture,
      delCityPicture: this.post.bind(this, API.home.delCityPicture),
      getBanner: this.get.bind(this, API.home.getBanner),
      uploadBanner: API.home.uploadBanner,
      delBanner: this.post.bind(this, API.home.delBanner)
    }

    this.account = {
      login: this.post.bind(this, API.account.login),
      getUserList: this.get.bind(this, API.account.getUserList)
    }

    this.resource = {
      getHouseList: this.post.bind(this, API.resource.getHouseList),
      addHouse: this.post.bind(this, API.resource.addHouse),
      upload: API.resource.upload,
      deleteHouse: this.post.bind(this, API.resource.deleteHouse)
    }

    this.discover = {
      getWonderfulList: this.get.bind(this, API.discover.getWonderfulList),
      getArticleDetail: this.get.bind(this, API.discover.getArticleDetail),
      addWonderful: this.post.bind(this, API.discover.addWonderful),
      uploadBanner: API.discover.uploadBanner
    }

    this.order = {
      getOrderList: this.post.bind(this, API.order.getOrderList)
    }

    this.resInterceptors();
  }

  formatParam(params) {
    if (params === {}) return {};

    let arr = [];
    for (let key in params) {
      arr.push(`${key}=${params[key]}`);
    }
    return `?${arr.join('&')}`;
  }

  get(url, params) {
    params = params || {};
    // 格式化参数形式
    params = this.formatParam(params);
    url += params;
    return axios.get(url).then(res => res.data);
  }

  post(url, data) {
    data = data || {};
    return axios.post(url, data).then(res => res.data);
  }

  resInterceptors() {
    return axios.interceptors.response.use(res => {
      if (res.data.code === 4) {
        message.warn('您的账户已经登录超时，请重新登录');
        setTimeout(() => {
          sessionStorage.removeItem('userInfo');
          sessionStorage.removeItem('curPath');
          window.history.go('/login');
        }, 1000);
      }
      return res;
    }, err => {
      return Promise.reject(err)
    })
  }
}

export default new Http();