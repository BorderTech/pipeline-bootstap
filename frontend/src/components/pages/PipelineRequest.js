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
			wbsCode: ''
		},
		error: ''
	};
	componentDidMount() {
		const { id } = this.props.match.params;
		this.getPipelineRequest(id);
	}
	render() {
		const { loading, error, creatingPipeline } = this.state;
		const {
			id,
			status,
			requestor,
			created,
			projectType,
			projectName,
			projectDescription,
			projectLead,
			projectTechLead,
			orgUnit,
			wbsCode,
			kanbanBoardRequired,
			projectManagementRequired,
			language
		} = this.state.pipelineRequest;
		return (
			<Fragment>
				{/* Page loading while waiting for backend response */}
				{loading ? <Loader /> : null}

				{/* Unsuccessful page load - i.e. request was not found */}
				{!loading && error ? <ErrorAlert message={error} /> : null}

				{/* Successful page load - display tables */}
				{id && !loading ? (
					<Fragment>
						<ProjectHeader
							id={id}
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
							kanbanBoardRequired={kanbanBoardRequired}
							projectManagementRequired={
								projectManagementRequired
							}
						/>
						<ConfluenceInformationTable />
						{/* Display optional table for software development projects */}
						{projectType === 'software' && (
							<BitbucketInformationTable language={language} />
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
			// Do something with the reponse...
			// console.log(response);
		} catch (error) {
			// Handle error here...
			console.log(error);
			this.setState({
				error: error.response.data.message,
				loading: false
			});
		}
		setTimeout(() => {
			this.setState({ creatingPipeline: false });
		}, 1000);
	};

	async getPipelineRequest(id) {
		try {
			this.setState({ loading: true });
			const response = await API.get(`pipeline-requests/${id}`);
			this.setState({ pipelineRequest: response.data, loading: false });
		} catch (error) {
			const { message } = error.response.data.message;
			this.setState({
				error: message,
				loading: false
			});
		}
	}
	makeCreatePipelineDto(pipelineRequest) {
		let createPipelineDto;
		// Properties shared by business & software projects
		const {
			projectType,
			projectName,
			projectDescription,
			projectLead,
			projectTechLead,
			orgUnit,
			wbsCode,
			projectManagementRequired,
			kanbanBoardRequired
		} = pipelineRequest;
		createPipelineDto = {
			projectType,
			projectName,
			projectDescription,
			projectLead,
			projectTechLead,
			orgUnit,
			wbsCode
		};
		// Properties unique to each type
		if (projectType === 'business') {
			createPipelineDto = {
				...createPipelineDto,
				projectManagementRequired
			};
		} else if (projectType === 'software') {
			createPipelineDto = { ...createPipelineDto, kanbanBoardRequired };
		}
		return createPipelineDto;
	}
}

export default PipelineRequest;
