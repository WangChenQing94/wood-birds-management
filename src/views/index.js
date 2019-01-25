import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { routes, login } from '../router/index';

class Index extends React.Component {
  render() {
    return (
      <Router>
        <main>
          <Route exact path={login.path} component={login.component}></Route>
          {
            routes.map((route, i) => {
              return (
                <Route key={i} exact={route.exact} path={route.path} component={route.component}></Route>
              )
            })
          }
        </main>
      </Router>
    )
  }
}

export default Index;