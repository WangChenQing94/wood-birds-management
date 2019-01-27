import React from 'react';
import { Route } from 'react-router-dom';
// 路由配置
import { routes } from '../../router/index';
import {
  Layout, Menu, Breadcrumb, Icon
} from 'antd';
// mobx数据管理插件
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import './index.less';

// @ -> 修饰符
@observer
class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);
    // 页面数据集合
    this.state = observable({
      menu: [
        {
          title: '首页',
          icon: '',
          url: '/home'
        },
        {
          title: '资源管理',
          icon: '',
          children: [
            {
              title: '首页管理',
              url: '/home-manage'
            },
            {
              title: '房源管理',
              url: '/house-manage'
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

  selectMenu = (item) => {
    console.log(item)
    console.log(item.title)
    console.log(item.url)
    const _this = this;
    _this.props.history.push(item.url);
  }

  // 渲染html的函数
  render() {
    const { SubMenu } = Menu;
    const { Header, Content, Sider } = Layout;
    const { menu } = this.state;

    // 侧边栏渲染
    const MenuComponent = (
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}>
        {
          menu.map((item, i) => {
            if (item.children) {
              return (
                <SubMenu key={i} title={<span>{item.title}</span>} >
                  {
                    item.children.map((cell, j) => (
                      <Menu.Item key={`${i}-${j}`} onClick={this.selectMenu.bind(this, cell)}>{cell.title}</Menu.Item>
                    ))
                  }
                </SubMenu>
              )
            } else {
              return (
                <Menu.Item key={i} onClick={this.selectMenu.bind(this, item)}>{item.title}</Menu.Item>
              )
            }
          })
        }
      </Menu>
    )

    return (
      <Layout className="layout-container">
        <Header className="header co-fff">
          <span className="font-18">木鸟短租后台管理系统</span>
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