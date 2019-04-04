import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox
} from 'antd';

import './login.scss';

import { LoginProps } from './interface';

class Login extends Component<LoginProps, any> {

  render() {
    const _this = this;
    const FormItem = Form.Item;
    const { getFieldDecorator } = _this.props.form;

    return (
      <div className="login">
        <Form className="login-form pos-fix">
          <p className="text-center">邻舍民宿CMS</p>
          <FormItem>
            {getFieldDecorator('loginName', {
              rules: [
                { required: true, message: '请输入用户名' }
              ]
            })(
              <Input placeholder="用户名"></Input>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入密码' }
              ]
            })(
              <Input placeholder="密码"></Input>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: false
            })(
              <Checkbox>记住我!</Checkbox>
            )}
          </FormItem>
          <Button type="primary">登录</Button>
        </Form>
      </div>
    )
  }
}

export default Form.create<LoginProps>({})(Login);