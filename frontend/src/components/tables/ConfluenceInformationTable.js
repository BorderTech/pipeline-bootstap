import React from 'react';
import { Table } from 'reactstrap';

export default function ConfluenceInformationTable() {
	return (
		<Table>
			<thead>
				<tr>
					<th colSpan={2}>Confluence Information</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td style={{ width: '50%' }}>Space Type</td>
					<td>Basic</td>
				</tr>
			</tbody>
		</Table>
	);
}
