import React from 'react';
import { Table } from 'reactstrap';

export default function JiraInformationTable({
	projectType,
	kanbanBoardRequired
}) {
	return (
		<Table>
			<thead>
				<tr>
					<th colSpan={2}>Jira Information</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td style={{ width: '50%' }}>Project Type</td>
					<td>Scrum</td>
				</tr>
				{projectType === 'software' && (
					<tr>
						<td>Kanban Board</td>
						<td>{kanbanBoardRequired ? 'Yes' : 'No'}</td>
					</tr>
				)}
			</tbody>
		</Table>
	);
}
