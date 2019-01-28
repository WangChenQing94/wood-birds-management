// 接口的配置文件;
const API = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://aileer.net';

const ACCOUNT = `${API}/account`;
const RESOURCE = `${API}/resource`;
const DISCOVER = `${API}/discover`;

const home = {
  getCityList: `${API}/getCityList`,
  addCity: `${API}/addCity`
};

const account = {
  getUserList: `${ACCOUNT}/getUserList`,
}

const resource = {
  getHouseList: `${RESOURCE}/list`,
  addHouse: `${RESOURCE}/addHouse`,
  upload: `${RESOURCE}/upload`
}

export default {
  API,
  home,
  account,
  resource
}