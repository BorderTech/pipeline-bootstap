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
				<tr id='requestor'>
					<td style={{ width: '50%' }}>Requestor</td>
					<td>{requestor}</td>
				</tr>
				<tr id='date'>
					<td>Date</td>
					<td>{created && new Date(created).toLocaleDateString()}</td>
				</tr>
				<tr id='name'>
					<td>Name</td>
					<td>{projectName}</td>
				</tr>
				<tr id='description'>
					<td>Description</td>
					<td>{projectDescription}</td>
				</tr>
				<tr id='projectType'>
					<td>Project Type</td>
					<td>{projectType}</td>
				</tr>
				<tr id='projectLead'>
					<td>Lead</td>
					<td>{projectLead}</td>
				</tr>
				<tr id='techLead'>
					<td>Tech Lead(s)</td>
					<td>
						{projectTechLead ? projectTechLead.toString() : '-'}
					</td>
				</tr>
				<tr id='orgUnit'>
					<td>Organisational Unit</td>
					<td>{orgUnit}</td>
				</tr>
				<tr id='wbsCode'>
					<td>WBS Code</td>
					<td>{wbsCode}</td>
				</tr>
			</tbody>
		</Table>
	);
}
