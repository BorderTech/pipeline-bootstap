import React, { Fragment } from 'react';
import { Table } from 'reactstrap';

export default function JiraInformationTable({
	projectType,
	kanbanBoardRequired,
	projectManagementRequired
}) {
	return (
		<Table>
			<thead>
				<tr>
					<th colSpan={2}>Jira Information</th>
				</tr>
			</thead>
			<tbody>
				<Fragment>
					{/* Software projects */}
					{projectType === 'software' && (
						<Fragment>
							<tr id='projectType'>
								<td style={{ width: '50%' }}>Project Type</td>
								<td>
									{kanbanBoardRequired ? 'Kanban' : 'Scrum'}
								</td>
							</tr>
						</Fragment>
					)}
					{/* Business projects */}
					{projectType === 'business' && (
						<Fragment>
							<tr id='projectType'>
								<td style={{ width: '50%' }}>Project Type</td>
								<td>
									{projectManagementRequired
										? 'Project'
										: 'Task'}{' '}
									Management
								</td>
							</tr>
						</Fragment>
					)}
				</Fragment>
			</tbody>
		</Table>
	);
}
