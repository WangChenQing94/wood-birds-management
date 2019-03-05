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
      menu: [
        {
          title: '资源管理',
          icon: '',
          children: [
            {
              title: '首页管理',
              url: '/home-manage',
            },
            {
              title: '房源管理',
              url: '/house-manage',
            },
            {
              title: '文章管理',
              url: '/article-manage'
            },
            {
              title: '城市管理',
              url: '/city-manage'
            },
            {
              title: '用户管理',
              url: '/user-manage'
            }
          ]
        }
      ]
    })
  }

  @action
  componentWillMount() {
    const _this = this;
    const curPath = sessionStorage.getItem('curPath');
    if (curPath) {
      _this.state.currentUrl = curPath;
    } else {
      _this.state.currentUrl = '/home-manage';
    }
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
    const { SubMenu } = Menu;
    const { Header, Content, Sider } = Layout;
    const { menu, currentUrl } = this.state;

    // 判断是否登录
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};
    if (!Object.keys(userInfo).length) {
      return (
        <Redirect to="/login" exact></Redirect>
      )
    }

    // if (userInfo && !userInfo.isAdmin) {
    //   _this.menu = [{
    //     title: '资源管理',
    //     icon: '',
    //     children: [
    //       {
    //         title: '房源管理',
    //         url: '/house-manage',
    //       }
    //     ]
    //   }]
    //   _this.currentUrl = '/house-manage';
    //   _this.props.history.push('/house-manage');
    // }

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
                    item.children.map((cell) => (
                      <Menu.Item key={cell.url} onClick={this.selectMenu.bind(this, cell)}>{cell.title}</Menu.Item>
                    ))
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
          <span className="font-18">木鸟短租后台管理系统</span>

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