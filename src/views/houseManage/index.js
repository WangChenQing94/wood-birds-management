import React from 'react';
import {
  Form,
  Select,
  Button,
  Input
} from 'antd'

class HouseManage extends React.Component {
  render() {
    const _this = this;
    const { getFieldDecorator } = _this.props.form;
    const { Item } = Form;
    const { Option } = Select;

    return (
      <div className="house-manage">
        <p className="page-title">
          <i></i>
          房源管理
        </p>
        <Form>
          <Item>
            {
              getFieldDecorator('name', {
                rules: []
              })(
                <Input placeholder="请输入房屋名称"></Input>
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator('price', {
                rules: []
              })(
                <Input placeholder="请输入房屋价格"></Input>
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator('lease', {
                rules: []
              })(
                <Select placeholder="选择租赁方式">
                  <Option value="0">整租</Option>
                  <Option value="1">合租</Option>
                </Select>
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator('buildType', {
                rules: []
              })(
                <Select placeholder="选择楼房类型">
                  <Option value="0">公寓</Option>
                  <Option value="1">民居</Option>
                  <Option value="2">客栈</Option>
                </Select>
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator('houseType', {
                rules: []
              })(
                <Select placeholder="选择房屋类型">
                  <Option value="0">一室</Option>
                  <Option value="1">二室</Option>
                  <Option value="2">三室</Option>
                  <Option value="3">四室以上</Option>
                </Select>
              )
            }
          </Item>
        </Form>
      </div>
    )
  }
}

export default Form.create()(HouseManage);