import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// 路由配置
import { routes } from '../../router/index';
import {
  Layout, Menu
} from 'antd';
// mobx数据管理插件
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import './index.less';

// @ -> 修饰符
@observer
class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);
    // 页面数据集合
    this.state = observable({
      currentUrl: '',
      auth: '',
      menu: [
        {
          title: '资源管理',
          icon: '',
          children: [
            {
              title: '首页管理',
              url: '/home-manage',
              auth: '0'
            },
            {
              title: '房源管理',
              url: '/house-manage',
              auth: '01'
            },
            {
              title: '订单管理',
              url: '/order-manage',
              auth: '1'
            },
            {
              title: '文章管理',
              url: '/article-manage',
              auth: '0'
            },
            {
              title: '城市管理',
              url: '/city-manage',
              auth: '0'
            },
            {
              title: '用户管理',
              url: '/user-manage',
              auth: '0'
            }
          ]
        }
      ]
    })
  }

  // 跳转页面
  selectMenu = (item) => {
    console.log(item)
    console.log(item.title)
    console.log(item.url)
    const _this = this;
    sessionStorage.setItem('curPath', item.url);
    _this.props.history.push(item.url);
  }

  // 退出登录
  handleLogout = () => {
    const _this = this;
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('curPath');
    _this.props.history.push('/login');
  }

  // 渲染html的函数
  @action
  render() {
    const _this = this;
    // 判断是否登录
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};
    if (!Object.keys(userInfo).length) {
      return (
        <Redirect to="/login" exact></Redirect>
      )
    }

    
    const curPath = sessionStorage.getItem('curPath');
    const isAdmin = JSON.parse(sessionStorage.getItem('userInfo')) && JSON.parse(sessionStorage.getItem('userInfo')).isAdmin;
    console.log(isAdmin);
    _this.state.auth = isAdmin ? '0' : '1';
    if (curPath) {
      _this.state.currentUrl = curPath;
    } else {
      _this.state.currentUrl = isAdmin ? '/home-manage' : '/house-manage';
    }

    const { SubMenu } = Menu;
    const { Header, Content, Sider } = Layout;
    const { menu, currentUrl } = this.state;

    // 侧边栏渲染
    const MenuComponent = (
      <Menu
        mode="inline"
        defaultSelectedKeys={[currentUrl]}
        defaultOpenKeys={['0']}
        style={{ height: '100%', borderRight: 0 }}>
        {
          menu.map((item, i) => {
            if (item.children) {
              return (
                <SubMenu key={i} title={<span>{item.title}</span>} >
                  {
                    item.children.map((cell) => {
                      if (cell.auth.indexOf(this.state.auth) > -1) {
                        return (
                          <Menu.Item key={cell.url} onClick={this.selectMenu.bind(this, cell)}>{cell.title}</Menu.Item>
                        )
                      } else {
                        return null
                      }
                    })
                  }
                </SubMenu>
              )
            } else {
              return (
                <Menu.Item key={item.url} onClick={this.selectMenu.bind(this, item)}>{item.title}</Menu.Item>
              )
            }
          })
        }
      </Menu>
    )

    return (
      <Layout className="layout-container">
        <Header className="header co-fff clear">
          <span className="font-18">邻舍民宿管理系统</span>

          <div className="user-info fr pos-re">
            <img src={userInfo.avatarUrl} alt="头像" />
            <span>{userInfo.name}</span>
            <ul className="user-operation-list pos-ab text-center pointer">
              <li onClick={this.handleLogout}>退出登录</li>
            </ul>
          </div>
        </Header>
        <Layout>
          <Sider>
            {MenuComponent}
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content className="container">
              {
                routes.map((route, i) => (
                  <Route key={i} path={route.path} component={route.component} exact={route.exact}></Route>
                ))
              }
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default LayoutComponent;