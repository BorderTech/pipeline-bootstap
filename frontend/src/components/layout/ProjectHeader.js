import React from 'react';
import Columns from '../layout/Columns';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function ProjectHeader({
	projectName,
	status,
	url,
	creatingPipeline,
	approvePipelineRequest
}) {
	return (
		<Columns>
			<h2>
				{projectName} (
				<a target='_blank' href={url} rel='noopener noreferrer'>
					View Jira
				</a>
				)
			</h2>
			<div style={{ float: 'right' }}>
				<Link to={`/pipeline-requests`}>
					<Button outline color='primary'>
						View all requests
					</Button>
				</Link>
				<Status
					value={status}
					creatingPipeline={creatingPipeline}
					approvePipelineRequest={approvePipelineRequest}
				></Status>
			</div>
		</Columns>
	);
}

function Status(props) {
	const { value, creatingPipeline, approvePipelineRequest } = props;
	/* eslint-disable indent */
	switch (value) {
		case 'To Do':
			return (
				<Button
					color='primary'
					onClick={approvePipelineRequest}
					disabled={creatingPipeline}
				>
					{!creatingPipeline
						? 'Approve Request'
						: 'Creating Pipeline...'}
				</Button>
			);
		case 'Done':
			return <Button color='success'>Complete</Button>;
		default:
			return <Button color='secondary'>{value}</Button>;
	}
}
