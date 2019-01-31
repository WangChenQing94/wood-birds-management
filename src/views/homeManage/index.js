import React from 'react';
import {
  Form,
  Upload,
  Icon,
  message
} from 'antd';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Http from '../../server/API.server';
import axios from 'axios';
import './index.less';

@observer
class HomeManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = observable({
      previewList: []
    })
  }

  componentDidMount() {
    this.getBanners();
  }

  // 获取首页的Banner
  @action
  getBanners = () => {
    const _this = this;
    Http.home.getBanner().then(res => {
      console.log('获取banner 结果 ----------- ')
      console.log(res);
      if (res.code === 0) {
        _this.state.previewList = res.data.banners;
      }
    })
  }

  // 上传banner图片
  @action
  uploadImage = ({ action, file }) => {
    const _this = this;
    const formData = new FormData();
    formData.append('file', file);
    axios.post(action, formData).then(res => {
      console.log('上传文件的结果 ---------- ')
      console.log(res);
      if (res.data.code === 0) {
        _this.state.previewList.push(res.data.data);
      }
    })
  }

  // 删除banner
  delBanner = (url) => {
    console.log(url)
    const _this = this;
    Http.home.delBanner({
      url
    }).then(res => {
      console.log('删除banner结果 ------------ ');
      console.log(res);
      if (res.code === 0) {
        _this.state.previewList.splice(_this.state.previewList.indexOf(url), 1);
      } else {
        message.error('删除失败');
      }
    })
  }

  render() {
    const _this = this;
    const { Item } = Form;
    const { previewList } = _this.state;

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
        <div className="fl preview-img pos-re" key={i}>
          <img src={item} alt="图片"/>
          <Icon type="delete" className="pos-ab" onClick={_this.delBanner.bind(this, item)}/>
        </div>
      ))
    )

    const uploadOption = {
      action: Http.home.uploadBanner,
      listType: 'picture-card',
      multiple: true,
      showUploadList: false,
      customRequest: _this.uploadImage,
      onChange: _this.handleUploadChange
    }

    return (
      <div className="home-manage">
        <p className="page-title">
          <i></i>
          首页管理
        </p>
        <Form>
          <Item label="首页轮播图" {...formItemLayout}>
            {uploadPreview}
            <Upload {...uploadOption} className="fl">
              {previewList.length >= 6 ? null : uploadButton}
            </Upload>
          </Item>
        </Form>
      </div>
    )
  }
}

export default HomeManage;