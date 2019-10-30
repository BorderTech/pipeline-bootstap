import React, { Component, Fragment } from 'react';
import API from '../../api/api';
import Loader from '../layout/Loader';
import ProjectHeader from '../layout/ProjectHeader';
import ProjectInformationTable from '../tables/ProjectInformationTable';
import JiraInformationTable from '../tables/JiraInformationTable';
import ConfluenceInformationTable from '../tables/ConfluenceInformationTable';
import BitbucketInformationTable from '../tables/BitbucketInformationTable';
import ErrorAlert from '../layout/ErrorAlert';

export class PipelineRequest extends Component {
	state = {
		loading: false,
		creatingPipeline: false,
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
		},
		errorMessage: '',
		errorObject: null
	};
	componentDidMount() {
		const { id } = this.props.match.params;
		this.getPipelineRequest(id);
	}
	render() {
		const {
			loading,
			errorMessage,
			errorObject,
			creatingPipeline,
			pipelineRequest
		} = this.state;
		const {
			id,
			status,
			requestor,
			created,
			projectType,
			jiraIssueUrl,
			projectName,
			projectDescription,
			projectLead,
			projectTechLead,
			orgUnit,
			wbsCode,
			businessMetadata,
			softwareMetadata
		} = pipelineRequest;
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
						<ProjectHeader
							url={jiraIssueUrl}
							status={status}
							projectName={projectName}
							creatingPipeline={creatingPipeline}
							approvePipelineRequest={this.approvePipelineRequest}
						></ProjectHeader>
						<ProjectInformationTable
							projectName={projectName}
							projectDescription={projectDescription}
							requestor={requestor}
							created={created}
							projectType={projectType}
							projectLead={projectLead}
							projectTechLead={projectTechLead}
							orgUnit={orgUnit}
							wbsCode={wbsCode}
						/>
						<JiraInformationTable
							projectType={projectType}
							// handle null values when different proj type
							kanbanBoardRequired={
								softwareMetadata
									? softwareMetadata.kanbanBoardRequired
									: false
							}
							projectManagementRequired={
								businessMetadata
									? businessMetadata.projectManagementRequired
									: false
							}
						/>
						<ConfluenceInformationTable spaceType='Basic' />
						{/* Display optional table for software development projects */}
						{projectType === 'software' && (
							<BitbucketInformationTable
								language={softwareMetadata.language}
							/>
						)}
					</Fragment>
				) : null}
			</Fragment>
		);
	}
	approvePipelineRequest = async () => {
		const { pipelineRequest } = this.state;
		const createPipelineDto = this.makeCreatePipelineDto(pipelineRequest);
		try {
			console.log('Approve pipeline clicked');
			this.setState({ creatingPipeline: true });
			const response = await API.post(`pipelines`, createPipelineDto);
			console.log(response);
		} catch (error) {
			this.setState({
				errorMessage: error.response.data.message,
				errorObject: error.response ? error.response : error,
				loading: false
			});
		}
		setTimeout(() => {
			this.setState({ creatingPipeline: false });
		}, 3000);
	};

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

	makeCreatePipelineDto(pipelineRequest) {
		let createPipelineDto = (({
			projectType,
			requestor,
			projectName,
			projectDescription,
			orgUnit,
			projectLead,
			wbsCode,
			businessMetadata,
			softwareMetadata
		}) => ({
			projectType,
			requestor,
			projectName,
			projectDescription,
			orgUnit,
			projectLead,
			wbsCode,
			businessMetadata,
			softwareMetadata
		}))(pipelineRequest);
		createPipelineDto.requestId = pipelineRequest.id;
		return createPipelineDto;
	}
}

export default PipelineRequest;
