import React from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Table,
  Modal,
  message,
  Switch,
  Upload,
  Icon
} from 'antd';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Http from '../../server/API.server';
import axios from 'axios';
import './index.less';

@observer
class CityManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = observable({
      isNew: false,
      isHot: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      currentCity: {},
      previewList: '',
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
          title: '热门城市',
          dataIndex: 'isHot'
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

  // 获取城市列表
  @action
  getCityList = () => {
    const _this = this;
    const { pageSize, pageNo } = _this.state;
    Http.home.getCityList({
      pageSize,
      pageNo
    }).then(res => {
      console.log('获取城市列表 结果---------------')
      console.log(res)
      if (res.code === 0) {
        _this.state.tableData = res.data.map(item => {
          item.key = item.code;
          item.isHot = item.isHot ? '是' : '否';
          return item;
        })
        _this.state.total = res.total;
        _this.state.pageNo = res.pageNo;
      }
    })
  }

  // 跳到新增或返回列表页
  @action
  addCityShowOrHide = () => {
    const _this = this;
    _this.state.isNew = !_this.state.isNew;
  }

  // 添加城市编码
  @action
  saveCity = () => {
    const _this = this;
    const { isHot, previewList } = _this.state;
    _this.props.form.validateFields((err, data) => {
      console.log(data);
      if (!err) {
        if (isHot) {
          if (!previewList) {
            message.warning('请上传城市图片');
            return;
          }
        }
        const postData = Object.assign({}, data)
        postData.isHot = isHot;
        postData.url = previewList;
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

  // 打开弹窗
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

  // 弹窗的确认方法
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

  // 弹窗取消函数
  @action
  handleModalCancel = () => {
    const _this = this;
    _this.state.visible = false;
  }

  // 设置热门城市
  @action
  handleIsHot = val => {
    const _this = this;
    _this.state.isHot = val;
  }

  // 上传城市图片
  @action
  uploadImage = ({ action, file }) => {
    const _this = this;
    const formData = new FormData();
    formData.append('file', file);
    axios.post(action, formData).then(res => {
      console.log('上传文件的结果 ---------- ')
      console.log(res);
      if (res.data.code === 0) {
        _this.state.previewList = res.data.data.url;
      }
    })
  }

  // 删除城市图片
  @action
  delCityPicture = () => {
    const _this = this;
    Http.home.delCityPicture({
      url: _this.state.previewList
    }).then(res => {
      console.log('删除城市图片结果 -------------- ');
      console.log(res);
      if (res.code === 0) {
        _this.state.previewList = '';
      }
    })
  }

  // 修改页码
  @action
  changePageNo = (val) => {
    const _this = this;
    _this.state.pageNo = val;
  }

  render() {
    const _this = this;
    const { isNew, columns, tableData, visible, modalTitle, previewList, isHot, total, pageSize, pageNo } = _this.state;
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

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    )

    const uploadPreview = (
      previewList ?
        (
          <div className="fl preview-img pos-re">
            <img src={previewList} alt="图片" />
            <Icon type="delete" className="pos-ab" onClick={_this.delCityPicture} />
          </div>
        ) : null
    )

    const uploadOption = {
      action: Http.home.uploadCityPicture,
      listType: 'picture-card',
      multiple: true,
      showUploadList: false,
      customRequest: _this.uploadImage,
      onChange: _this.handleUploadChange
    }

    const newCityForm = (
      <Form>
        <Item label="热门城市" {...formItemLayout}>
          <Switch onChange={_this.handleIsHot}></Switch>
        </Item>
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
        {
          isHot ?
            (
              <Item {...formItemLayout} label="城市图片" className="clear">
                <Upload {...uploadOption} className="fl">
                  {previewList ? null : uploadButton}
                </Upload>
                {uploadPreview}
              </Item>
            ) : null
        }
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
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={{
              total,
              pageSize,
              current: pageNo,
              onChange: _this.changePageNo
            }}></Table>
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