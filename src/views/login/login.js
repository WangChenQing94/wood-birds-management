import React from 'react';
import {
  Form,
  Input,
  Button,
  Icon
} from 'antd';
import './login.less';

class Login extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { Item } = Form;
    return (
      <div className="login">
        登录
        <Form className="login-form">
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
                <Input prefix={<Icon type="lock" />} placeholder="密码"></Input>
              )
            }
          </Item>
          <div>
            <Button type="primary">登录</Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create()(Login);