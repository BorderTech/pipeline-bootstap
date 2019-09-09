import React from 'react';
import Columns from '../layout/Columns';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function ProjectHeader({ projectName, status, id }) {
	return (
		<Columns>
			<h2>
				{projectName} (
				<a target='_blank' href={`/`}>
					{id}
				</a>
				)
			</h2>
			<div style={{ float: 'right' }}>
				<Link to={`/pipeline-requests`}>
					<Button outline color='primary'>
						View all requests
					</Button>
				</Link>
				<Status value={status}></Status>
			</div>
		</Columns>
	);
}

function Status(props) {
	const { value } = props;
	/* eslint-disable indent */
	switch (value) {
		case 'To Do':
			return <Button color='primary'>Approve Request</Button>;
		case 'Done':
			return <Button color='success'>Complete</Button>;
		default:
			return <Button color='secondary'>{value}</Button>;
	}
}
