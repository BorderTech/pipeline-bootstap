import React, { Fragment } from 'react';
import PipelineRequestsTable from '../tables/PipelineRequestsTable';
import { Button } from 'reactstrap';

export default function PipelineRequests() {
	return (
		<Fragment>
			<h2>Pipeline Requests</h2>
			<PipelineRequestsTable />
		</Fragment>
	);
}
