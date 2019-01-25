import React from 'react';
import { Route, Link } from 'react-router-dom';

class Layout extends React.Component {
  render() {
    const { routes } = this.props;
    console.log(this.props);
    return (
      <div>
        <div><Link to="/login">登录</Link></div>
        {
          // routes.map((route, i) => (
          //   <Route key={i} path={route.path} component={route.component} exact={route.exact}></Route>
          // ))
        }
      </div>
    )
  }
}

export default Layout;