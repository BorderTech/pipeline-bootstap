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
		data: {
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

	async getPipelineRequest(id) {
		try {
			this.setState({ loading: true });
			const response = await API.get(`pipeline-requests/${id}`);
			this.setState({ data: response.data, loading: false });
		} catch (error) {
			this.setState({
				error: error.response.data.message,
				loading: false
			});
		}
	}
	render() {
		const { loading, error } = this.state;
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
		} = this.state.data;
		return (
			<Fragment>
				{/* Page loading while waiting for backend response */}
				{loading ? <Loader /> : null}

				{/* Unsuccessful page load - i.e. request was not found */}
				{!loading && error ? <ErrorAlert message={error} /> : null}

				{/* Successful page load - display tables */}
				{!error && !loading ? (
					<Fragment>
						<ProjectHeader
							id={id}
							status={status}
							projectName={projectName}
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
}

export default PipelineRequest;
