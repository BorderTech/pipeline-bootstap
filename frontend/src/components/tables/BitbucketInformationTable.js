import React from 'react';
import { Table } from 'reactstrap';

export default function BitbucketInformationTable({ language }) {
	return (
		<Table>
			<thead>
				<tr>
					<th colSpan={2}>Bitbucket Information</th>
				</tr>
			</thead>
			<tbody>
				<tr id='language'>
					<td style={{ width: '50%' }}>Language</td>
					<td>{language}</td>
				</tr>
			</tbody>
		</Table>
	);
}
