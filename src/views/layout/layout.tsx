import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { routesProps, routeType } from '../../interface';

import Header from '../../components/header/header';

class Layout extends Component<routesProps, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    const _this = this;
    const { routes } = _this.props;

    const routesRender = routes.map((item: routeType, i: number) => (
      <Route key={i} render={props => (
        <item.component {...props} routes={item.routes}></item.component>
      )}></Route>
    ))

    return (
      <div className="layout">
        <Header></Header>
        <Switch>
          {routesRender}
        </Switch>
      </div>
    )
  }
}

export default Layout