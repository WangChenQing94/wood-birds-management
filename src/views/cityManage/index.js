import React from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Table,
  Modal,
  message
} from 'antd';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Http from '../../server/API.server';

@observer
class CityManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = observable({
      isNew: false,
      currentCity: {},
      modalTitle: '',
      visible: false,
      columns: [
        {
          title: '城市名称',
          dataIndex: 'name'
        },
        {
          title: '城市编码',
          dataIndex: 'code'
        },
        {
          title: '操作',
          render: (text, record, index) => (
            <span className="pointer co-primary" onClick={this.visibleModal.bind(this, record)}>删除</span>
          )
        }
      ],
      tableData: []
    })
  }


  componentDidMount() {
    this.getCityList();
  }

  @action
  getCityList = () => {
    const _this = this;
    Http.home.getCityList({
      pageSize: 10,
      pageNo: 1
    }).then(res => {
      console.log('获取城市列表 结果---------------')
      console.log(res)
      if (res.code === 0) {
        _this.state.tableData = res.data.map(item => {
          item.key = item.code;
          return item;
        })
      }
    })
  }

  @action
  addCityShowOrHide = () => {
    const _this = this;
    _this.state.isNew = !_this.state.isNew;
  }

  // 添加城市编码
  @action
  saveCity = () => {
    const _this = this;
    _this.props.form.validateFields((err, data) => {
      console.log(data);
      if (!err) {
        Http.home.addCity(data).then(res => {
          console.log('添加城市编码 结果 -----------')
          console.log(res)
          if (res.code === 0) {
            _this.state.isNew = !_this.state.isNew;
            _this.getCityList();
          } else {
            message.error(res.msg);
          }
        })
      }
    })
  }

  @action
  visibleModal = (info) => {
    const _this = this;
    _this.state.visible = true;
    _this.state.modalTitle = (
      <div className="page-title">
        <i></i>
        删除城市
      </div>
    )
    _this.state.currentCity = info;
  }

  @action
  handleModalOk = () => {
    const _this = this;
    const { code } = _this.state.currentCity;
    Http.home.deleteCity({
      code
    }).then(res => {
      console.log('删除城市结果 ------------ ')
      console.log(res)
      if (res.code === 0) {
        _this.state.visible = false;
        _this.getCityList();
      } else {
        _this.state.visible = false;
        message.error('城市删除失败');
      }
    })
  }

  @action
  handleModalCancel = () => {
    const _this = this;
    _this.state.visible = false;
  }

  render() {
    const _this = this;
    const { isNew, columns, tableData, visible, modalTitle } = _this.state;
    const { Item } = Form;
    const { getFieldDecorator } = _this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15, offset: 1 },
      },
    };
    const newCityForm = (
      <Form>
        <Item label="城市名称" {...formItemLayout}>
          {
            getFieldDecorator('name', {
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input placeholder="请输入城市名称"></Input>
            )
          }
        </Item>
        <Item label="城市编码" {...formItemLayout}>
          {
            getFieldDecorator('code', {
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input placeholder="请输入城市编码"></Input>
            )
          }
        </Item>
        <Item label="父级城市编码" {...formItemLayout}>
          {
            getFieldDecorator('parentCode', {
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input placeholder="请输入父级城市编码"></Input>
            )
          }
        </Item>
        <Row>
          <Col span={14} offset={5}>
            <Button type="primary" onClick={_this.saveCity}>保存</Button>
            <Button type="primary" onClick={_this.addCityShowOrHide} className="btn-primary-transparent">返回</Button>
          </Col>
        </Row>
      </Form>
    )

    const cityList = (
      <div className="city-list">
        <div>
          <Button type="primary" onClick={_this.addCityShowOrHide}>新增</Button>
        </div>
        <div className="table">
          <Table columns={columns} dataSource={tableData}></Table>
        </div>
      </div>
    )

    const modalOption = {
      visible,
      title: modalTitle,
      onOk: _this.handleModalOk,
      onCancel: _this.handleModalCancel
    }
    const deleteModal = (
      <Modal {...modalOption}>
        <p>是否删除该城市?</p>
      </Modal>
    )

    return (
      <div className="city-manage">
        <p className="page-title">
          <i></i>
          城市管理
        </p>
        {
          isNew ? newCityForm : cityList
        }
        {deleteModal}
      </div>
    )
  }
}

export default Form.create()(CityManage);