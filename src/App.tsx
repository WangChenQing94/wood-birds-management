import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import routes from './router/index';
import { routeType } from './interface';

class App extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    const _this = this;
    // 渲染路由
    const routeRender = routes.map((item: routeType, i: number) => (
      <Route key={i} path={item.path} render={props => (
        <item.component {...props} routes={item.routes}></item.component>
      )}></Route>
    ))

    return (
      <Router>
        <div id="app">
          <Switch>
            {routeRender}
            <Redirect from='/' to='/login'></Redirect>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;