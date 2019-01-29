import React from 'react';
import {
  Form,
  Input,
  Button,
  Icon
} from 'antd';
import Crypto from 'crypto-js';
import Http from '../../server/API.server';
import './login.less';

class Login extends React.Component {
  // 登录方法
  login = () => {
    console.log('登录');
    const _this = this;
    _this.props.form.validateFields((err, { phone, password }) => {
      console.log(err)
      if (!err) {
        Http.account.login({
          phone,
          password: Crypto.MD5(`${phone}${Crypto.MD5(password)}`)
        }).then(res => {
          console.log('登录结果 ---------- ')
          console.log(res);
        })
      }
    })
    this.props.history.push('/home');
  }

  render() {
    // 定义Form的检验函数
    const { getFieldDecorator } = this.props.form;
    // 定义Form的组件
    const { Item } = Form;
    return (
      <div className="login">
        <Form className="login-form">
          <p className="title text-center font-24">木鸟短租后台管理系统</p>
          <Item>
            {
              getFieldDecorator('userName', {

              })(
                <Input prefix={<Icon type="user" />} placeholder="用户名"></Input>
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator('password', {

              })(
                <Input type="password" prefix={<Icon type="lock" />} placeholder="密码"></Input>
              )
            }
          </Item>
          <div>
            <Button type="primary" onClick={this.login}>登录</Button>
          </div>
        </Form>
      </div>
    )
  }
}

// 使用Form时，需使用create方法创建表单组件，并传入你定义的组件
export default Form.create()(Login);