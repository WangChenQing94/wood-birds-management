import React from 'react';
import {
	Table,
	message
} from 'antd';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import Http from '../../server/API.server';
import { formatDate } from '../../utils/tool';

@observer
class OrderManage extends React.Component {
	constructor(props) {
		super(props);
		this.state = observable({
			userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
			columns: [
				{
					title: '房源名称',
					key: 'name',
					render: (text, record) => {
						return (
							<span>{(record.houses && record.houses.name) || '邻舍民宿'}</span>
						)
					}
				},
				{
					title: '位置',
					key: 'address',
					render: (text, record) => {
						const house = record.houses || {}
						const address = `${house.province || ''} ${house.city || ''} ${house.region || ''} ${house.addrDetail || ''}`
						return (
							<span>{address || '未知'}</span>
						)
					}
				},
				{
					title: '金额',
					dataIndex: 'totalPrice'
				},
				{
					title: '入住时间',
					dataIndex: 'beginTime'
				},
				{
					title: '退房时间',
					dataIndex: 'endTime'
				}
			],
			tableData: [],
			pageSize: 10,
			pageNo: 1,
			total: 0
		})
	}

	componentDidMount() {
		const _this = this;
		_this.getOrderList();
	}

	/**
	 * 获取订单列表
	 */
	@action
	getOrderList = () => {
		const _this = this;
		Http.order.getOrderList({
			status: 2,
			userId: _this.state.userId,
			pageSize: 10,
			pageNo: _this.state.pageNo
		}).then(res => {
			console.log(res)
			if (res.code === 0) {
				res.data.forEach((item, i) => {
					item.key = i;
					item.beginTime = formatDate(item.beginTime);
					item.endTime = formatDate(item.endTime);
				})
				_this.state.total = res.total;
				_this.state.tableData = [].concat(res.data);
			}
		})
	}
	
	@action
	handleChange = (val) => {
		const _this = this;
		_this.state.pageNo = val;
		_this.getOrderList();
	}

	render() {
		const _this = this;
		const { columns, tableData, pageSize, pageNo, total } = _this.state;


		return (
			<div className="order-manage">
				<p className="page-title">
					<i></i>
					订单管理
				</p>
				<div className="order-table">
					<Table
						columns={columns}
						dataSource={tableData}
						pagination={{
							total,
							pageSize,
							current: pageNo,
							onChange: _this.handleChange
						}}></Table>
				</div>
			</div>
		)
	}
}

export default OrderManage;