// 接口的配置文件;
const API = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://aileer.net';

const ACCOUNT = `${API}/account`;
const RESOURCE = `${API}/resource`;
const DISCOVER = `${API}/discover`;

const home = {
  getCityList: `${API}/getCityList`,
  addCity: `${API}/addCity`,
  deleteCity: `${API}/deleteCity`
};

const account = {
  login: `${ACCOUNT}/login`,
  getUserList: `${ACCOUNT}/getUserList`,
}

const resource = {
  getHouseList: `${RESOURCE}/list`,
  addHouse: `${RESOURCE}/addHouse`,
  upload: `${RESOURCE}/upload`,
  deleteHouse: `${RESOURCE}/deleteHouse`
}

export default {
  API,
  home,
  account,
  resource
}