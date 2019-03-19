// 接口的配置文件;
// const API = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:3000';
const API = process.env.NODE_ENV === 'development' ? 'http://localhost:3010' : 'https://aileer.net';

const ACCOUNT = `${API}/account`;
const RESOURCE = `${API}/resource`;
const DISCOVER = `${API}/discover`;
const ORDER = `${API}/order`;

const home = {
  getCityList: `${API}/getCityList`, // 获取城市列表
  addCity: `${API}/addCity`, // 添加城市
  deleteCity: `${API}/deleteCity`, // 删除城市
  uploadCityPicture: `${API}/uploadCityPicture`, // 上传城市图片
  delCityPicture: `${API}/delCityPicture`, // 删除城市图片
  getBanner: `${API}/home`, // 获取首页的Banner
  uploadBanner: `${API}/uploadBanner`, // 上传首页Banner
  delBanner: `${API}/delBanner` // 删除首页Banner
};

const account = {
  login: `${ACCOUNT}/login`, // 登录
  getUserList: `${ACCOUNT}/getUserList`, // 获取用户列表
}

const resource = {
  getHouseList: `${RESOURCE}/list`, // 获取房源列表
  addHouse: `${RESOURCE}/addHouse`, // 添加房源
  upload: `${RESOURCE}/upload`, // 上传房源图片
  deleteHouse: `${RESOURCE}/deleteHouse`, // 删除房源
  deleteHousePicture: `${RESOURCE}/deleteHousePicture` // 删除房源图片
}

const discover = {
  getWonderfulList: `${DISCOVER}/wonderful`,  // 获取文章列表
  getArticleDetail: `${DISCOVER}/articleDetail`, // 获取文章详情
  addWonderful: `${DISCOVER}/addWonderful`, // 添加文章
  uploadBanner: `${DISCOVER}/uploadBanner`, // 上传文章封面
  delWonderful: `${DISCOVER}/delWonderful` // 删除文章
}

const order = {
  getOrderList: `${ORDER}/getOrderList`, // 获取订单列表
}

export default {
  API,
  home,
  account,
  resource,
  discover,
  order
}