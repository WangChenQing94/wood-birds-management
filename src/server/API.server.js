// 接口服务的类函数

// 引入axios  类似ajax,原理使用的是Promise
import axios from 'axios';
import API from './API.config';

// 定义接口Http类
class Http {
  constructor() {
    this.home = {
      getCityList: this.get.bind(this, API.home.getCityList),
      addCity: this.post.bind(this, API.home.addCity)
    }

    this.account = {
      getUserList: this.get.bind(this, API.account.getUserList)
    }

    this.resource = {
      getHouseList: this.post.bind(this, API.resource.getHouseList),
      addHouse: this.post.bind(this, API.resource.addHouse),
      upload: API.resource.upload
    }
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
}

export default new Http();