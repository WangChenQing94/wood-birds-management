import React from 'react';
import {
  Row,
  Col,
  Table,
  Form,
  Select,
  Upload,
  Icon,
  Button,
  Switch,
  Modal,
  Checkbox,
  DatePicker,
  TimePicker,
  Cascader,
  Input,
  message
} from 'antd'
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Http from '../../server/API.server';
import axios from 'axios';
import './index.less'

@observer
class HouseManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = observable({
      isNew: false,
      visible: false,
      modalTitle: '',
      currentHouse: {},
      previewList: [],
      fileList: [],
      pageSize: 10,
      pageNo: 1,
      total: 0,
      columns: [
        {
          title: '房屋名称',
          dataIndex: 'name'
        },
        {
          title: '房屋价格',
          dataIndex: 'price'
        },
        {
          title: '租赁方式',
          dataIndex: 'lease'
        },
        {
          title: '楼房类型',
          dataIndex: 'buildType'
        },
        {
          title: '房屋类型',
          dataIndex: 'houseType'
        },
        {
          title: '操作',
          render: (text, recored, index) => (
            <span className="co-primary pointer" onClick={this.showModal.bind(this, recored)}>删除</span>
          )
        }
      ],
      tableData: [],
      cityList: [],
      configure: [
        { label: '无线WIFI', value: 'net' },
        { label: '电视', value: 'tv' },
        { label: '淋浴', value: 'shower' },
        { label: '空调', value: 'air' },
        { label: '暖气', value: 'heating' },
        { label: '洗衣机', value: 'washer' },
        { label: '电冰箱', value: 'freezer' },
        { label: '全天热水', value: 'hotWater' },
        { label: '厨房', value: 'kitchen' },
        { label: '毛巾', value: 'towel' },
        { label: '拖鞋', value: 'slipper' },
        { label: '一次性用品', value: 'once' },
        { label: '热水壶', value: 'kettle' },
        { label: '电梯', value: 'elevator' },
        { label: '餐具炊具', value: 'tableware' },
        { label: '吹风机', value: 'blower' },
        { label: '智能门锁', value: 'smartLock' },
        { label: '允许做饭', value: 'cook' }
      ]
    })
  }

  @action
  componentDidMount() {
    const _this = this;
    _this.getCityList();
    _this.getHouseList();
  }

  // 获取城市列表
  @action
  getCityList = () => {
    // const _this = this;
    Http.home.getCityList({
      pageSize: 9999,
      pageNo: 1
    }).then(res => {
      console.log('获取城市列表结果 ------------- ')
      console.log(res);
    })
  }

  // 获取房源列表
  @action
  getHouseList = () => {
    const _this = this;
    const { pageSize, pageNo } = _this.state;
    Http.resource.getHouseList({
      pageSize,
      pageNo
    }).then(res => {
      console.log(res);
      if (res.code === 0) {
        _this.state.tableData = res.data.map((item, i) => {
          item.key = i;
          switch (Number(item.lease)) {
            case 0:
              item.lease = '整租';
              break;
            case 1:
              item.lease = '合租';
              break;
            default:
              break;
          }
          switch (Number(item.buildType)) {
            case 0:
              item.buildType = '公寓';
              break;
            case 1:
              item.buildType = '民居';
              break;
            case 2:
              item.buildType = '客栈';
              break;
            default:
              break;
          }
          switch (Number(item.houseType)) {
            case 0:
              item.houseType = '一室';
              break;
            case 1:
              item.houseType = '二室';
              break;
            case 2:
              item.houseType = '三室';
              break;
            case 3:
              item.houseType = '四室以上';
              break;
            default:
              break;
          }
          return item;
        });
        _this.state.total = res.total;
        _this.state.pageNo = res.pageNo;
      }
    })
  }

  // 显示弹窗
  @action
  showModal = (info) => {
    const _this = this;
    console.log(info);
    _this.state.visible = true;
    _this.state.currentHouse = info;
    _this.state.modalTitle = (
      <div className="page-title">
        <i></i>
        删除房源
      </div>
    )
  }

  // 显示或隐藏添加房源的界面
  @action
  addHouseVisible = () => {
    const _this = this;
    _this.state.modalTitle = '删除房源';
    _this.state.isNew = !_this.state.isNew;
  }

  // 保存房源信息
  @action
  handleAddHouse = (e) => {
    e.preventDefault();
    const _this = this;
    const { previewList } = _this.state;
    _this.props.form.validateFieldsAndScroll((err, data) => {
      console.log(err)
      console.log(data)
      if (!err) {
        if (!previewList.length) {
          message.error('请上传房源图片');
          return
        }
        const postData = JSON.parse(JSON.stringify(data));
        postData.beginTime = new Date(postData.beginAndEndTime[0]).getTime();
        postData.endTime = new Date(postData.beginAndEndTime[1]).getTime();
        const details = {
          describe: postData.describe
        };
        const notes = {
          checkInTime: postData.checkInTime,
          checkOutTime: postData.checkInTime,
          daysToStay: postData.daysToStay,
          idCard: postData.idCard,
          deposit: postData.deposit,
          landlordReq: postData.landlordReq,
          notice: postData.notice
        };
        const configure = {};
        for (let key in postData.configure) {
          configure[key] = true;
        }
        for (let key in details) {
          delete postData[key];
        }
        for (let key in notes) {
          delete postData[key];
        }
        delete postData.beginAndEndTime;
        delete postData.configure;
        postData.images = _this.previewList;
        postData.notes = notes;
        postData.details = details;
        postData.configure = configure;
        Http.resource.addHouse(postData).then(res => {
          console.log('添加房源信息 结果----------------')
          console.log(res);
        })
      }
    })
  }

  // 上传房源文件
  @action
  uploadImage = ({ action, file }) => {
    const _this = this;
    const formData = new FormData();
    formData.append('file', file);
    axios.post(action, formData).then(res => {
      console.log('上传文件的结果 ---------- ')
      console.log(res);
      if (res.data.code === 0) {
        _this.state.previewList.push(res.data.data[0]);
      }
    })
  }

  @action
  // 确认删除房源
  handleModalOk = () => {
    const _this = this;
    console.log(_this.state.currentHouse);
    const { houseId } = _this.state.currentHouse;
    Http.resource.deleteHouse({
      houseId
    }).then(res => {
      console.log('删除房源的结果-------------');
      console.log(res);
      if (res.code === 0) {
        _this.state.visible = false;
        _this.getHouseList();
      } else {
        _this.state.visible = false;
        message.error('该房源删除失败');
      }
    })
  }

  @action
  handleModalCancel = () => {
    const _this = this;
    _this.state.visible = false;
  }

  // 修改页码
  @action
  changePageNo = (val) => {
    const _this = this;
    _this.state.pageNo = val;
  }

  render() {
    const _this = this;
    const { previewList, visible, modalTitle, total, pageNo, pageSize } = _this.state;
    const { getFieldDecorator } = _this.props.form;
    const { Item } = Form;
    const { TextArea } = Input;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const CheckboxGroup = Checkbox.Group;

    const isAdmin = JSON.parse(sessionStorage.getItem('userInfo')).isAdmin;

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
      previewList.map((item, i) => (
        <img className="fl preview-img" src={item} alt="图片" key={i} />
      ))
    )

    const uploadOption = {
      action: Http.resource.upload,
      listType: 'picture-card',
      multiple: true,
      showUploadList: false,
      customRequest: _this.uploadImage,
      onChange: _this.handleUploadChange
    }

    // 添加房源
    const addHouseComponent = (
      <Form>
        <Item {...formItemLayout} label="房屋名称">
          {
            getFieldDecorator('name', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入房屋名称"></Input>
            )
          }
        </Item>
        <Item {...formItemLayout} label="房屋价格">
          {
            getFieldDecorator('price', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入房屋价格"></Input>
            )
          }
        </Item>
        <Item {...formItemLayout} label="房屋面积">
          {
            getFieldDecorator('area', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入房屋面积"></Input>
            )
          }
        </Item>
        <Item {...formItemLayout} label="租赁方式">
          {
            getFieldDecorator('lease', {
              rules: [{
                required: true
              }]
            })(
              <Select placeholder="选择租赁方式">
                <Option value="0">整租</Option>
                <Option value="1">合租</Option>
              </Select>
            )
          }
        </Item>
        <Item {...formItemLayout} label="楼房类型">
          {
            getFieldDecorator('buildType', {
              rules: [{
                required: true
              }]
            })(
              <Select placeholder="选择楼房类型">
                <Option value="0">公寓</Option>
                <Option value="1">民居</Option>
                <Option value="2">客栈</Option>
              </Select>
            )
          }
        </Item>
        <Item {...formItemLayout} label="房屋类型">
          {
            getFieldDecorator('houseType', {
              rules: [{
                required: true
              }]
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
        <Item {...formItemLayout} label="床型">
          {
            getFieldDecorator('bedType', {
              rules: [{
                required: true
              }]
            })(
              <Select placeholder="选择床型">
                <Option value="0">单人床</Option>
                <Option value="1">双人床</Option>
                <Option value="2">其他</Option>
              </Select>
            )
          }
        </Item>
        <Item {...formItemLayout} label="卫生间">
          {
            getFieldDecorator('toilet', {
              rules: [{
                required: true
              }]
            })(
              <Select placeholder="选择卫生间">
                <Option value="0">独立卫生间</Option>
                <Option value="1">公共卫生间</Option>
              </Select>
            )
          }
        </Item>
        <Item {...formItemLayout} label="居住人数">
          {
            getFieldDecorator('peoples', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入居住人数"></Input>
            )
          }
        </Item>
        <Item {...formItemLayout} label="住房时间">
          {
            getFieldDecorator('beginAndEndTime', {
              rules: [{
                required: true
              }]
            })(
              <RangePicker></RangePicker>
            )
          }
        </Item>
        <Item {...formItemLayout} label="省市区">
          {
            getFieldDecorator('address', {
              rules: [{
                required: true
              }]
            })(
              <Cascader options={this.state.cityList} placeholder="请选择省市区"></Cascader>
            )
          }
        </Item>
        <Item {...formItemLayout} label="详细地址">
          {
            getFieldDecorator('addrDetail', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入详情地址"></Input>
            )
          }
        </Item>
        <Item {...formItemLayout} label="房屋描述">
          {
            getFieldDecorator('describe', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入房屋描述"></Input>
            )
          }
        </Item>
        <Item {...formItemLayout} label="房屋配置">
          {
            getFieldDecorator('configure', {
              rules: [{
                required: true
              }]
            })(
              <CheckboxGroup options={this.state.configure}></CheckboxGroup>
            )
          }
        </Item>
        <Item {...formItemLayout} label="最早最晚时间">
          {
            getFieldDecorator('checkInTime', {
              rules: [{
                required: true
              }]
            })(
              <TimePicker className="margin-right20" placeholder="最早入住时间" format={'HH:mm'}></TimePicker>
            )
          }
          {
            getFieldDecorator('checkOutTime', {
              rules: []
            })(
              <TimePicker placeholder="最晚退房时间" format={'HH:mm'}></TimePicker>
            )
          }
        </Item>
        <Item {...formItemLayout} label="最少入住天数">
          {
            getFieldDecorator('daysToStay', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入最少入住天数"></Input>
            )
          }
        </Item>
        <Item {...formItemLayout} label="身份证">
          {
            getFieldDecorator('idCard', {
              rules: [{
                required: true
              }]
            })(
              <Switch checkedChildren="需要" unCheckedChildren="不需要"></Switch>
            )
          }
        </Item>
        <Item {...formItemLayout} label="线下押金">
          {
            getFieldDecorator('deposit', {
              rules: [{
                required: true
              }]
            })(
              <Switch checkedChildren="需要" unCheckedChildren="不需要"></Switch>
            )
          }
        </Item>
        <Item {...formItemLayout} label="房屋要求">
          {
            getFieldDecorator('landlordReq', {
              rules: [{
                required: true
              }]
            })(
              <TextArea rows={4} placeholder="请输入房屋要求"></TextArea>
            )
          }
        </Item>
        <Item {...formItemLayout} label="入住须知">
          {
            getFieldDecorator('notice', {
              rules: [{
                required: true
              }]
            })(
              <TextArea rows={4} placeholder="请输入入住须知"></TextArea>
            )
          }
        </Item>
        <Item {...formItemLayout} label="上传房源图片" className="clear">
          <Upload {...uploadOption} className="fl">
            {previewList.length >= 6 ? null : uploadButton}
          </Upload>
          {uploadPreview}
        </Item>
        <Row className="form-footer">
          <Col offset={5} span={16}>
            <Button type="primary" onClick={_this.handleAddHouse}>保存</Button>
            <Button type="primary" className="btn-primary-transparent" onClick={_this.addHouseVisible}>返回</Button>
          </Col>
        </Row>
      </Form>
    )

    // 房源列表
    const houseListComponent = (
      <div>
        <div className="search-box">
          <Row gutter={16}>
            {
              !isAdmin ?
                (
                  <Col span={8}>
                    <Button type="primary" onClick={_this.addHouseVisible}>新增</Button>
                  </Col>
                ) : null
            }
          </Row>
        </div>
        <div className="table">
          <Table
            columns={_this.state.columns}
            dataSource={_this.state.tableData}
            pagination={{
              total: total,
              pageSize: pageSize,
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
    const dialog = (
      <Modal {...modalOption}>
        <p>是否删除该房源</p>
      </Modal>
    )

    return (
      <div className="house-manage">
        <p className="page-title">
          <i></i>
          房源管理
        </p>
        {
          _this.state.isNew ? addHouseComponent : houseListComponent
        }
        {dialog}
      </div>
    )
  }
}

export default Form.create()(HouseManage);