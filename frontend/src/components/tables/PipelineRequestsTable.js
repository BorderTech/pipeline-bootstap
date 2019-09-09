import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { ReactTableDefaults } from 'react-table';
import 'react-table/react-table.css';
import { Button } from 'reactstrap';
import API from '../../api/api';

export class PipelineRequestsTable extends Component {
	state = {
		filter: 'To Do',
		loading: true,
		data: []
	};
	async componentDidMount() {
		this.getPipelineRequests();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.filter !== this.state.filter) {
			this.getPipelineRequests();
		}
	}

	async getPipelineRequests() {
		const { filter } = this.state;
		try {
			this.setState({ loading: true });
			const response = await API.get(
				`pipeline-requests?status=${filter}`
			);
			this.setState({ data: response.data, loading: false });
		} catch (err) {
			console.log(err);
			this.setState({ loading: false });
		}
	}

	render() {
		return (
			<ReactTable
				data={this.state.data}
				columns={[
					{
						Header: 'Requestor',
						accessor: 'requestor',
						width: 150
					},
					{
						Header: 'Request Date',
						accessor: 'created',
						width: 150,
						Cell: row => new Date(row.value).toLocaleDateString()
					},
					{
						Header: 'Project Name',
						accessor: 'projectName',
						width: 230
					},
					{
						Header: 'Project Description',
						accessor: 'projectDescription',
						width: 470
					},
					{
						Header: 'Status',
						accessor: 'id',
						filterable: true,
						width: 100,
						Filter: () => (
							<select
								onChange={event =>
									this.setState({
										filter: event.target.value
									})
								}
								style={{ width: '100%' }}
								value={this.state.filter}
							>
								<option value='To Do'>To Do</option>
								<option value='Done'>Done</option>
							</select>
						),
						Cell: row => (
							<div>
								<Link to={`/pipeline-requests/${row.value}`}>
									<Button block color='primary'>
										View
									</Button>
								</Link>
							</div>
						)
					}
				]}
				minRows={5}
				defaultPageSize={20}
				className='-striped -highlight'
				column={{
					...ReactTableDefaults.column,
					headerStyle: { fontWeight: 'bold', textAlign: 'left' }
				}}
				filterable={true}
				loading={this.state.loading}
			/>
		);
	}
}

export default PipelineRequestsTable;
