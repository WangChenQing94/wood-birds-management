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
import { arrayToJson } from '../../utils/tool';
import AMap from 'AMap';
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
      fieldNames: {
        label: 'name',
        value: 'code'
      },
      address: '',
      location: '',
      map: null,
      geoCoder: null,
      marker: null,
      cityList: [
        {
          value: '00001',
          label: '上海',
          children: [
            {
              value: '00002',
              label: '浦东新区'
            }
          ]
        },
        {
          value: '00003',
          label: '北京',
          children: [
            {
              value: '00004',
              label: '朝阳区'
            }
          ]
        }
      ],
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
    const _this = this;
    Http.home.getCityList({
      pageSize: 9999,
      pageNo: 1
    }).then(res => {
      console.log('获取城市列表结果 ------------- ')
      console.log(res);
      if (res.code === 0) {
        _this.state.cityList = [].concat(arrayToJson(res.data));
        console.log(_this.state.cityList);
      }
    })
  }

  // 获取房源列表
  @action
  getHouseList = () => {
    const _this = this;
    const { pageSize, pageNo } = _this.state;
    Http.resource.getHouseList({
      pageSize,
      pageNo,
      sort: 0
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
    if (!_this.state.isNew) {
      _this.getCityList();
      _this.state.location = '';
      _this.state.address = '';
    }
    _this.state.previewList = [];
    _this.state.isNew = !_this.state.isNew;
    if (_this.state.isNew) {
      setTimeout(() => {
        _this.state.map = new AMap.Map('map', {
          resizeEnable: true
        });
      }, 0)
    }
  }

  // 保存房源信息
  @action
  handleAddHouse = (e) => {
    e.preventDefault();
    const _this = this;
    const { previewList } = _this.state;
    /**
     * 表单验证，必填字段
     */
    _this.props.form.validateFieldsAndScroll((err, data) => {
      console.log(err)
      console.log(data)
      if (!err) {
        if (!previewList.length) {
          message.error('请上传房源图片');
          return
        }
        if (!_this.state.location) {
          message.error('请确定房源定位');
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
        for (let key of postData.configure) {
          configure[key] = true;
        }
        for (let key in details) {
          delete postData[key];
        }
        for (let key in notes) {
          delete postData[key];
        }
        postData.images = previewList;
        postData.notes = notes;
        postData.details = details;
        postData.configure = configure;
        postData.province = '';
        postData.city = postData.address[0] || '';
        postData.region = postData.address[1] || '';
        postData.location = _this.state.location;
        delete postData.beginAndEndTime;
        // delete postData.configure;
        delete postData.address;

        Http.resource.addHouse(postData).then(res => {
          console.log('添加房源信息 结果----------------');
          console.log(res);
          if (res.code === 0) {
            message.success('添加房源成功');
            _this.state.isNew = false;
            _this.getHouseList();
          } else {
            message.error('添加房源失败');
          }
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
    _this.getHouseList();
  }

  // 删除房源图片
  @action
  handleDeletePicture = (url, index) => {
    const _this = this;
    console.log(url);
    Http.resource.deleteHousePicture({
      url
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        _this.state.previewList.splice(index, 1);
      }
    })
  }

  @action
  geoCode = () => {
    const _this = this;
    const { address } = _this.state;
    if (!_this.state.geoCoder) {
      _this.state.geoCoder = new AMap.Geocoder()
    }

    console.log(address)
    _this.state.geoCoder.getLocation(address, function (status, result) {
      console.log(status);
      console.log(result);
      if (status === 'complete' && result.geocodes.length) {
        _this.state.location = result.geocodes[0].location;
        if (!_this.state.marker) {
          _this.state.marker = new AMap.Marker();
          _this.state.map.add(_this.state.marker);
        }
        _this.state.marker.setPosition(_this.state.location);
        _this.state.map.setFitView(_this.state.marker);
      }
    });
  }

  @action
  handleChange = e => {
    const _this = this;
    _this.state.address = e.currentTarget.value;
  }

  render() {
    const _this = this;
    const { previewList, visible, modalTitle, total, pageNo, pageSize } = _this.state;
    const { getFieldDecorator } = _this.props.form;
    const FormItem = Form.Item;
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
        <div className="pos-re fl preview" key={i}>
          <Icon type="delete" className="pos-ab pointer" onClick={_this.handleDeletePicture.bind(this, item, i)} />
          <img className="preview-img" src={item} alt="图片" />
        </div>
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
        <FormItem {...formItemLayout} label="房屋名称">
          {
            getFieldDecorator('name', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入房屋名称"></Input>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="房屋价格">
          {
            getFieldDecorator('price', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入房屋价格"></Input>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="房屋面积">
          {
            getFieldDecorator('area', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入房屋面积"></Input>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="租赁方式">
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
        </FormItem>
        <FormItem {...formItemLayout} label="楼房类型">
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
        </FormItem>
        <FormItem {...formItemLayout} label="房屋类型">
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
        </FormItem>
        <FormItem {...formItemLayout} label="床型">
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
        </FormItem>
        <FormItem {...formItemLayout} label="卫生间">
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
        </FormItem>
        <FormItem {...formItemLayout} label="居住人数">
          {
            getFieldDecorator('peoples', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入居住人数"></Input>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="住房时间">
          {
            getFieldDecorator('beginAndEndTime', {
              rules: [{
                required: true
              }]
            })(
              <RangePicker></RangePicker>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="市区">
          {
            getFieldDecorator('address', {
              rules: [{
                required: true
              }]
            })(
              <Cascader options={this.state.cityList} fieldNames={this.state.fieldNames} placeholder="请选择城市和地区"></Cascader>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="详细地址">
          {
            getFieldDecorator('addrDetail', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入详情地址"></Input>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="房屋描述">
          {
            getFieldDecorator('describe', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入房屋描述"></Input>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="房屋配置">
          {
            getFieldDecorator('configure', {
              rules: [{
                required: true
              }]
            })(
              <CheckboxGroup options={this.state.configure}></CheckboxGroup>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="最早最晚时间">
          <FormItem>
            {
              getFieldDecorator('checkInTime', {
                rules: [{
                  required: true
                }]
              })(
                <TimePicker className="margin-right20" placeholder="最早入住时间" format={'HH:mm'}></TimePicker>
              )
            }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('checkOutTime', {
                rules: []
              })(
                <TimePicker placeholder="最晚退房时间" format={'HH:mm'}></TimePicker>
              )
            }
          </FormItem>
        </FormItem>
        <FormItem {...formItemLayout} label="最少入住天数">
          {
            getFieldDecorator('daysToStay', {
              rules: [{
                required: true
              }]
            })(
              <Input placeholder="请输入最少入住天数"></Input>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="身份证">
          {
            getFieldDecorator('idCard', {})(
              <Switch checkedChildren="需要" unCheckedChildren="不需要"></Switch>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="线下押金">
          {
            getFieldDecorator('deposit', {})(
              <Switch checkedChildren="需要" unCheckedChildren="不需要"></Switch>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="房屋要求">
          {
            getFieldDecorator('landlordReq', {})(
              <TextArea rows={4} placeholder="请输入房屋要求"></TextArea>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="入住须知">
          {
            getFieldDecorator('notice', {})(
              <TextArea rows={4} placeholder="请输入入住须知"></TextArea>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="定位" className="map-container">
          <div id="map" className="pos-re"></div>
          <div className="input-card pos-ab">
            <label>地理编码，根据地址获取经纬度坐标</label>
            <div className="input-item">
              <div className="input-item-prepend"><span className="input-item-text">地址</span></div>
              <input type="text" onChange={_this.handleChange}/>
            </div>
            <div className="input-item">
              <div className="input-item-prepend"><span className="input-item-text">经纬度</span></div>
              <input type="text" disabled value={_this.state.location} />
            </div>
            <input onClick={_this.geoCode} type="button" className="btn" value="地址 -> 经纬度" />
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label="上传房源图片" className="clear">
          <Upload {...uploadOption} className="fl">
            {previewList.length >= 6 ? null : uploadButton}
          </Upload>
          {uploadPreview}
        </FormItem>
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