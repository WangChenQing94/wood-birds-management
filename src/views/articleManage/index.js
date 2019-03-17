import React from 'react';
import {
	Table,
	Button,
	Input,
	Upload,
	Icon,
	message
} from 'antd';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Http from '../../server/API.server';
import axios from 'axios';
import { formatDate } from '../../utils/tool';
import './index.less';

@observer
class ArticleManage extends React.Component {
	constructor(props) {
		super(props);
		this.state = observable({
			isNew: false,
			columns: [
				{
					title: '文章标题',
					dataIndex: 'title',
				},
				{
					title: '创建时间',
					dataIndex: 'createTime',
				},
				{
					title: '内容',
					render: (text, record, index) => (
						<div className="ellipsis" style={{ 'width': '300px', maxHeight: '300px' }} dangerouslySetInnerHTML={{ __html: record.content || '' }}></div>
					)
				},
				{
					title: '操作',
					render: (text, record, index) => (
						<span className="pointer co-primary" onClick={this.handleArticle.bind(this, record)}>删除</span>
					)
				}
			],
			tableData: [],
			total: 0,
			pageSize: 10,
			pageNo: 1,
			ueditor: null,
			title: '',
			previewList: []
		})
	}

	componentDidMount() {
		const _this = this;
		_this.getList();
	}

	@action
	componentWillUnmount() {
		const _this = this;
		_this.state.ueditor && _this.state.ueditor.destroy();
	}

	// 初始化UEditor
	@action
	initUeditor = () => {
		const _this = this;
		const UE = window.UE;
		_this.state.ueditor = UE.getEditor('ueditor', {
			initialFrameHeight: 300,
			autoHeight: true,
			elementPathEnabled: false,
			autoSyncData: false,
			wordCount: false,
			toolbars: [
				['fullscreen', 'source', 'undo', 'redo'],
				['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', 'insertimage', 'link']
			],
			imageActionName: '/discover/uploadImage',
			imageAllowFiles: [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
			imagePathFormat: '/images/article',
			imageUrlPrefix: ''
		});
	}

	// 获取文章列表
	@action
	getList = () => {
		const _this = this;
		const { pageSize, pageNo } = _this.state;
		Http.discover.getWonderfulList({
			pageSize,
			pageNo
		}).then(res => {
			console.log(res)
			if (res.code === 0) {
				_this.state.tableData = res.data.map((item, i) => {
					item.key = i;
					item.createTime = formatDate(item.createTime);
					return item;
				});
			}
		})
	}

	// 删除文章
	@action
	handleArticle = (obj) => {
		const _this = this;
		Http.discover.delWonderful({ id: obj.id }).then(res => {
			console.log(res);
			if (res.code === 0) {
				_this.getList();
			} else {
				message.error(res.msg);
			}
		})
	}

	// 新增文章
	@action
	handleNew = () => {
		const _this = this;
		_this.state.isNew = true;
		setTimeout(() => {
			if (_this.state.ueditor) {
				_this.state.ueditor.setShow();
				_this.state.ueditor.setContent('');
			} else {
				_this.initUeditor();
			}
		}, 1)
	}

	// 从新增返回列表
	@action
	handleBack = () => {
		const _this = this;
		_this.state.ueditor.setHide();
		_this.state.isNew = false;
		_this.getList();
	}

	// 文章标题
	@action
	handleChange = e => {
		const _this = this;
		console.log(e)
		_this.state.title = e.target.value;
	}

	// 添加文章
	@action
	addArticle = () => {
		const _this = this;
		const { ueditor, title } = _this.state;
		console.log(ueditor.getContent());
		console.log(title)
		Http.discover.addWonderful({
			title,
			content: ueditor.getContent(),
			bannerUrl: _this.state.previewList[0]
		}).then(res => {
			console.log(res)
			if (res.code === 0) {
				message.success('添加文章成功');
				_this.handleBack();
			} else {
				message.error('添加文章失败');
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
				_this.state.previewList.push(res.data.data.url);
				console.log(_this.state.previewList)
			}
		})
	}

	@action
	handleDel = (index) => {
		const _this = this;
		_this.state.previewList.splice(index, 1);
	}

	render() {
		const _this = this;
		const { isNew, columns, tableData, total, pageNo, pageSize, previewList } = _this.state;

		const uploadOption = {
			action: Http.discover.uploadBanner,
			listType: 'picture-card',
			multiple: false,
			showUploadList: false,
			customRequest: _this.uploadImage
		}

		const ArticleList = (
			<div className="article-list">
				<div><Button type="primary" onClick={_this.handleNew}>新增</Button></div>
				<div className="table">
					<Table
						columns={columns}
						dataSource={tableData}
						pagination={{
							total,
							pageSize,
							current: pageNo
						}}></Table>
				</div>
			</div>
		)

		const uploadButton = (
			<div className="upload">
				<Icon type="plus" />
				<div className="ant-upload-text">上传封面图片</div>
			</div>
		)

		const previewImg = (
			previewList.map((item, i) => (
				<div className="preview-img pos-re" key={i}>
					<Icon type="delete" className="pos-ab pointer" onClick={_this.handleDel.bind(this, i)} />
					<img src={item} alt="图片" />
				</div>
			))
		)

		const newArticleForm = (
			<div className="article-form">
				<Input className="article-title" placeholder="请输入文章标题" onChange={_this.handleChange}></Input>
				<div id="ueditor" name="content"></div>
				<Upload {...uploadOption}>
					{previewList.length >= 1 ? null : uploadButton}
				</Upload>
				{previewImg}
				<footer>
					<Button type="primary" onClick={_this.handleBack}>返回</Button>
					<Button type="primary" onClick={_this.addArticle}>发布</Button>
				</footer>
			</div>
		)


		return (
			<div className="article-manage">
				<p className="page-title">
					<i></i>
					文章管理
				</p>
				{
					isNew ? newArticleForm : ArticleList
				}
			</div>
		)
	}
}

export default ArticleManage;