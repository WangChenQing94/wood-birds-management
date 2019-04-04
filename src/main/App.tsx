import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import routes from '../router/index';

interface routeType {
  path: string,
  component: any,
  routes?: routeType,
  exact?: boolean
}

class App extends Component {
  render() {

    // 渲染路由
    const routeRender = routes.map((item: routeType, i: number) => (
      <Route path={item.path} render={props => (
        <item.component {...props} routes={item.routes}></item.component>
      )}></Route>
    ))

    return (
      <Router>
        <div id="app">
          {routeRender}
        </div>
      </Router>
    )
  }
}

export default App;