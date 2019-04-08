import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { routesProps, routeType } from '../../interface';

import Header from '../../components/header/header';

class Layout extends Component<routesProps, any> {
  constructor(props: any) {
    super(props)
  }

  componentDidMount() {
    const _this = this;
    _this.redirectLogin();
  }

  redirectLogin = () => {
    const _this = this;
    if (_this.props.location.pathname === '/') {
      _this.props.history.push('/login')
    }
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