import React from 'react';
import ReactDOM from 'react-dom';
// 引用antd框架的样式表
import 'antd/dist/antd.css';
// 引用自定义样式表(放在框架下面，需要时可覆盖框架样式)
import './index.css';
// 入口文件
import Index from './views/index';
// react服务配置文件
import * as serviceWorker from './serviceWorker';

// React渲染入口文件
ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
