import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import Loader from '../layout/Loader';
import API from '../../api/api';
import ErrorAlert from '../layout/ErrorAlert';

export class PipelineRequestSuccess extends Component {
	state = {
		loading: false,
		errorMessage: '',
		errorObject: {},
		pipelineRequest: {
			id: '',
			status: '',
			projectName: '',
			projectDescription: '',
			projectLead: '',
			requestor: '',
			created: '',
			projectType: '',
			orgUnit: '',
			jiraIssueUrl: '',
			wbsCode: '',
			businessMetadata: {
				projectManagementRequired: false
			},
			softwareMetadata: {
				kanbanBoardRequired: false,
				language: ''
			}
		}
	};
	componentDidMount() {
		const { id } = this.props.match.params;
		this.getPipelineRequest(id);
		console.log(id);
	}

	async getPipelineRequest(id) {
		try {
			this.setState({ loading: true });
			const response = await API.get(`pipeline-requests/${id}`);
			this.setState({ pipelineRequest: response.data, loading: false });
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
		const {
			loading,
			errorMessage,
			errorObject,
			pipelineRequest
		} = this.state;
		const { id, jiraIssueUrl } = pipelineRequest;

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
						<h2>Success</h2>
						<h3>Your request has been submitted successfully.</h3>
						<h4>You can track your progress here:</h4>
						<h5>
							{' '}
							Jira Issue:{' '}
							<a
								target='_blank'
								rel='noopener noreferrer'
								href={jiraIssueUrl}
							>
								{jiraIssueUrl}
							</a>
						</h5>
						<Link to='/pipeline-requests/create'>
							<Button color='primary'>Create New Request</Button>
						</Link>
					</Fragment>
				) : null}
			</Fragment>
		);
	}
}

export default PipelineRequestSuccess;
