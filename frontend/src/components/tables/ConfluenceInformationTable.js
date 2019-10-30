import React from 'react';
import { Table } from 'reactstrap';

export default function ConfluenceInformationTable({ spaceType }) {
	return (
		<Table>
			<thead>
				<tr>
					<th colSpan={2}>Confluence Information</th>
				</tr>
			</thead>
			<tbody>
				<tr id='spaceType'>
					<td style={{ width: '50%' }}>Space Type</td>
					<td>{spaceType}</td>
				</tr>
			</tbody>
		</Table>
	);
}
