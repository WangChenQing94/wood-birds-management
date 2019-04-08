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
  constructor(props: LoginProps) {
    super(props)
  }

  login = () => {
    const _this = this;
    _this.props.form.validateFields((err, value) => {
      console.log(err)
      console.log(value)
      if (!err) {
        _this.props.history.push('/analysis');
      }
    })
  }

  render() {
    const _this = this;
    const FormItem = Form.Item;
    const { getFieldDecorator } = _this.props.form;

    return (
      <div className="login">
        <Form className="login-form pos-fix">
          <p className="text-center login-title font-24">邻舍民宿CMS</p>
          <FormItem>
            {getFieldDecorator('loginName', {
              rules: [
                { required: true, message: '请输入用户名' }
              ]
            })(
              <Input className="form-input" placeholder="用户名" autoComplete="off"></Input>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入密码' }
              ]
            })(
              <Input className="form-input" placeholder="密码" autoComplete="off"></Input>
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
          <Button type="primary" className="btn-login" onClick={_this.login}>登录</Button>
        </Form>
      </div>
    )
  }
}

export default Form.create<LoginProps>()(Login);