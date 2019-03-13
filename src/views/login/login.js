import React from 'react';
import {
  Form,
  Input,
  Button,
  Icon,
  message
} from 'antd';
import Crypto from 'crypto-js';
import Http from '../../server/API.server';
import './login.less';

class Login extends React.Component {
  // 登录方法
  login = e => {
    e.preventDefault();
    const _this = this;
    _this.props.form.validateFields((err, { phone, password }) => {
      if (!err) {
        console.log(Crypto.MD5(`${phone}${Crypto.MD5(password).toString()}`).toString());
        Http.account.login({
          phone,
          password: Crypto.MD5(`${phone}${Crypto.MD5(password).toString()}`).toString()
        }).then(res => {
          console.log('登录结果 ---------- ');
          console.log(res);
          if (res.code === 0) {
            sessionStorage.setItem('userInfo', JSON.stringify(res.data));
            if (res.data.isAdmin) {
              _this.props.history.push('/home-manage');
            } else {
              _this.props.history.push('/house-manage');
            }
          } else {
            message.error('用户名密码错误');
          }
        })
      }
    })
  }

  render() {
    // 定义Form的检验函数
    const { getFieldDecorator } = this.props.form;
    // 定义Form的组件
    const { Item } = Form;
    return (
      <div className="login">
        <Form className="login-form" onSubmit={this.login}>
          <p className="title text-center font-24">邻舍民宿管理系统</p>
          <Item>
            {
              getFieldDecorator('phone', {

              })(
                <Input prefix={<Icon type="user" />} placeholder="手机号" autoComplete="off"></Input>
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator('password', {

              })(
                <Input type="password" prefix={<Icon type="lock" />} placeholder="密码" autoComplete="off"></Input>
              )
            }
          </Item>
          <div>
            <Button type="primary" htmlType="submit">登录</Button>
          </div>
        </Form>
      </div>
    )
  }
}

// 使用Form时，需使用create方法创建表单组件，并传入你定义的组件
export default Form.create()(Login);