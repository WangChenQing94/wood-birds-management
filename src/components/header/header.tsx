import React, { Component } from 'react';
import {
  Icon
} from 'antd';

import './header.scss';

class Header extends Component {
  render() {
    return (
      <div className="header clear">
        <div className="head-left fl">
          <span>邻舍民宿</span>
        </div>

        <div className="head-right fr clear">
          <ul className="fl">
            <li className="icon notify-icon pointer"><Icon type="bell"></Icon></li>
          </ul>
          <div className="user-info fr">
            <img src="" alt="头像"/>
            <span>超级管理员</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;