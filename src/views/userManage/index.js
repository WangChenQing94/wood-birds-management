import React from 'react';
import API from '../../server/API.config';
import Http from '../../server/API.server';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import './index.less';

@observer
class UserManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = observable({
      total: 0,
      pageSize: 10,
      pageNo: 1,
      userList: []
    })
  }

  @action
  componentDidMount() {
    const _this = this;
    Http.account.getUserList({
      pageNo: 1,
      pageSize: 10
    }).then(res => {
      console.log('获取用户列表返回值----------------');
      console.log(res);
      if (res.code === 0) {
        _this.state.userList = res.data.map(item => {
          if (item.phone === 'admin') {
            item.avatarUrl = `${API.API}/${item.avatarUrl}`;
          }
          return item;
        });
        _this.state.total = res.total;
      }
    })
  }

  render() {
    const _this = this;
    const { userList } = _this.state;

    console.log(userList)
    const users = (
      userList.map((user, i) => (
        <li key={i} className="fl">
          <div>
            <img src={user.avatarUrl} alt="头像" />
            <p className="text-center">{user.name}</p>
          </div>
        </li>
      ))
    )

    return (
      <div className="user-manage">
        <p className="page-title">
          <i></i>
          用户管理
        </p>
        <ul className="user-list clear">{users}</ul>
      </div>
    )
  }
}

export default UserManage;