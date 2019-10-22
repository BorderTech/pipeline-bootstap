import React, { Fragment } from 'react';
import { Table } from 'reactstrap';

export default function ArtefactsInformationTable({ artefacts }) {
	return (
		<Table>
			{artefacts.map(artefact => {
				return (
					<Fragment key={artefact.id}>
						<thead>
							<tr>
								<th colSpan={2}>{artefact.type}</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Name</td>
								<td>{artefact.name}</td>
							</tr>
							<tr>
								<td>URL</td>
								<td>
									<a href={artefact.url}>{artefact.url}</a>
								</td>
							</tr>
						</tbody>
					</Fragment>
				);
			})}
		</Table>
	);
}
