import React from 'react';
import { Table } from 'reactstrap';

export default function ProjectInformationTable({
	requestor,
	created,
	projectName,
	projectDescription,
	projectType,
	projectLead,
	projectTechLead,
	orgUnit,
	wbsCode
}) {
	return (
		<Table>
			<thead>
				<tr>
					<th colSpan={2}>Project Information</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td style={{ width: '50%' }}>Requestor</td>
					<td>{requestor}</td>
				</tr>
				<tr>
					<td>Date</td>
					<td>{new Date(created).toLocaleDateString()}</td>
				</tr>
				<tr>
					<td>Name</td>
					<td>{projectName}</td>
				</tr>
				<tr>
					<td>Description</td>
					<td>{projectDescription}</td>
				</tr>
				<tr>
					<td>Project Type</td>
					<td>{projectType}</td>
				</tr>
				<tr>
					<td>Lead</td>
					<td>{projectLead}</td>
				</tr>
				<tr>
					<td>Tech Lead(s)</td>
					<td>
						{projectTechLead ? projectTechLead.toString() : '-'}
					</td>
				</tr>
				<tr>
					<td>Organisational Unit</td>
					<td>{orgUnit}</td>
				</tr>
				<tr>
					<td>WBS Code</td>
					<td>{wbsCode}</td>
				</tr>
			</tbody>
		</Table>
	);
}
