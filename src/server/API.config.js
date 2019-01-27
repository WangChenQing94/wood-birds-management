// 接口的配置文件;
const API = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://aileer.net';

const ACCOUNT = `${API}/account`;
const RESOURCE = `${API}/resource`;
const DISCOVER = `${API}/discover`;

const home = {};

const account = {
  getUserList: `${ACCOUNT}/getUserList`
}

export default {
  API,
  account,
}