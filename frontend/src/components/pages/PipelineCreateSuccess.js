import React, { Component, Fragment } from 'react';
import Loader from '../layout/Loader';
import API from '../../api/api';
import ErrorAlert from '../layout/ErrorAlert';
import { Table } from 'reactstrap';
import ArtefactsInformationTable from '../tables/ArtefactsInformationTable';

export class PipelineCreateSuccess extends Component {
	state = {
		loading: false,
		errorMessage: '',
		errorObject: {},
		pipeline: {
			id: 0,
			name: '',
			artefacts: [
				{
					id: 0,
					key: '',
					name: '',
					url: '',
					type: ''
				}
			]
		}
	};

	componentDidMount() {
		const { id } = this.props.match.params;
		this.getPipeline(id);
	}

	async getPipeline(id) {
		try {
			this.setState({ loading: true });
			const response = await API.get(`pipelines/${id}`);
			this.setState({ pipeline: response.data, loading: false });
		} catch (error) {
			const { message } = error.response.data.message;
			this.setState({
				errorMessage: message,
				errorObject: error.response ? error.response : error,
				loading: false
			});
		}
	}

	render() {
		const { loading, errorObject, errorMessage, pipeline } = this.state;
		const { id, name, artefacts } = pipeline;
		return (
			<Fragment>
				{/* Page loading while waiting for backend response */}
				{loading ? <Loader /> : null}

				{/* Unsuccessful page load - i.e. request was not found */}
				{!loading && errorMessage ? (
					<ErrorAlert
						message={errorMessage}
						errorObject={errorObject}
					/>
				) : null}

				{/* Successful page load - display tables */}
				{id && !loading ? (
					<Fragment>
						<h2>Your pipeline has been created successfully.</h2>
						<Table>
							<thead>
								<tr>
									<th colSpan={2}>Project Information</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Name</td>
									<td>{name}</td>
								</tr>
							</tbody>
						</Table>
						<ArtefactsInformationTable artefacts={artefacts} />
					</Fragment>
				) : null}
			</Fragment>
		);
	}
}

export default PipelineCreateSuccess;
