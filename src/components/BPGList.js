import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import $ from 'jquery'
import ReactTable from 'react-table'

// this class displays the list of BPGs page
class BPGList extends Component {
	constructor(props) {
		super(props) // required by reactjs semantics
		this.state = {
			loading: true,
			latest: true,
			toggleText: "Show All"
		} // initially, show page loading animation

		this.fetchDataAll = this.fetchDataAll.bind(this)
		this.toggle = this.toggle.bind(this)
	}

	// this fetches data from server endpoint
	fetchData() {
		$.get('/db/BPG')
			.done(data => {
				console.log(data)
				this.setState({
					data,
					loading: false,
				})
			})
	}

	fetchDataAll() {
		$.get('/db/BPG/All')
			.done(data => {
				console.log(data)
				this.setState({
					data,
					loading: false,
				})
			})
	}

	toggle() {
		if (this.state.latest) {
			this.setState({
				latest: false,
				toggleText: 'Show Latest',
				loading: true,
			})
			this.fetchDataAll()
		} else {
			this.setState({
				latest: true,
				toggleText: 'Show All',
				loading: true,
			})
			this.fetchData()
		}

	}

	// this fires before class is constructed, get initial data
	componentDidMount() {
		this.fetchData()
	}

	// render view
	render() {

		// define columns
		const columns = [{
			Header: () =>
				<div>
					<Button secondary content="Select Env" icon='left arrow' labelPosition='left' style={{
						position: 'absolute',
						left: 0,
					}} onClick={() => {
						window.location.replace('/')
					}} />
					<Button secondary content={this.state.toggleText} onClick={this.toggle} style={{
						position: 'absolute',
						right: 0,
					}} />
					<h1 style={{ margin: 0 }}>Business Process Group List</h1>
				</div>,
			columns: [{
				Header: 'Business Process Group Name',
				accessor: 'name',
				minWidth: 300,
				Cell: row => <Link to={this.props.next + '/' + row.original._id}>{row.original._id}</Link>,
			}, {
				Header: () => <div
					style={{
						width: '100%',
						height: '100%',
						backgroundColor: '#01FF70',
					}}>Pass</div>,
				accessor: 'pass',
				maxWidth: 100,
			}, {
				Header: () => <div
					style={{
						width: '100%',
						height: '100%',
						backgroundColor: '#FF4136',
					}}>Fail</div>,
				accessor: 'fail',
				maxWidth: 100,
			}, {
				Header: () => <div
					style={{
						width: '100%',
						height: '100%',
						backgroundColor: '#AAAAAA',
					}}>Skip</div>,
				accessor: 'skip',
				maxWidth: 100,
			}],
		}]

		return (
			<div>
				{ /* define table, details see TC.js */}
				<ReactTable
					loading={this.state.loading}
					data={this.state.data}
					resizable={this.props.tableStyle.resizable}
					className={this.props.tableStyle.className}
					style={this.props.tableStyle.style}
					defaultPageSize={6}
					columns={columns}
				/>
				<h1 style={{ textAlign: 'center' }}>Graph</h1>

				{ /* defines a barchart */}
				<ResponsiveContainer height={500}>
					<BarChart
						data={this.state.data}
						maxBarSize={100}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}>
						<XAxis dataKey="_id" />
						<YAxis />
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip />
						<Legend />
						<Bar dataKey="pass" stackId="a" fill="#60BD68" />
						<Bar dataKey="fail" stackId="a" fill="#F15854" />
						<Bar dataKey="skip" stackId="a" fill="#AAAAAA" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		)
	}
}


export default BPGList
