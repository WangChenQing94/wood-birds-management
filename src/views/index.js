// 入口页面配置
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { login } from '../router/index';
import Layout from './layout/index';
import './index.less';

class Index extends React.Component {

  render() {
    return (
      <Router>
        <main>
          <Route exact path={login.path} component={login.component}></Route>
          <Route path="/" component={Layout}></Route>
        </main>
      </Router>
    )
  }
}

export default Index;