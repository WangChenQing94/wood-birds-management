import React from 'react';
import ReactDOM from 'react-dom';
// 引用antd框架的样式表
import 'antd/dist/antd.css';
// 引用自定义样式表(放在框架下面，需要时可覆盖框架样式)
import './index.css';
// 入口文件
import Index from './views/index';

// 国际化配置
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
// react服务配置文件
import * as serviceWorker from './serviceWorker';

moment.locale('zh-cn');

// React渲染入口文件
ReactDOM.render(<LocaleProvider locale={zh_CN}><Index /></LocaleProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
