import React, { Component, Fragment } from 'react';
import Loader from '../layout/Loader';
import PipelineRequestsTable from '../tables/PipelineRequestsTable';
import API from '../../api/api';

export class PipelineRequests extends Component {
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

	handleStatusFilterChange = status => {
		this.setState({
			filter: status
		});
	};

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
		const { data, loading, filter } = this.state;
		return (
			<Fragment>
				{/* Page loading while waiting for backend response */}
				{loading ? <Loader /> : null}

				{/* Successful page load - display tables */}
				{!loading ? (
					<Fragment>
						<h2>Pipeline Requests</h2>
						<PipelineRequestsTable
							data={data}
							loading={loading}
							filter={filter}
							handleStatusFilterChange={
								this.handleStatusFilterChange
							}
						/>
					</Fragment>
				) : null}
			</Fragment>
		);
	}
}

export default PipelineRequests;
