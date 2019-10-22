import React from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { ReactTableDefaults } from 'react-table';
import 'react-table/react-table.css';
import { Button, Input } from 'reactstrap';

export default function PipelineRequestsTable({
	data,
	loading,
	filter,
	handleStatusFilterChange
}) {
	return (
		<ReactTable
			data={data}
			columns={[
				{
					Header: 'Requestor',
					accessor: 'requestor',
					width: 150,
					Filter: ({ filter, onChange }) => (
						<Input
							onChange={event => onChange(event.target.value)}
							value={filter ? filter.value : ''}
							aria-label='Requestor'
						/>
					)
				},
				{
					Header: 'Request Date',
					accessor: 'created',
					width: 150,
					Cell: row => new Date(row.value).toLocaleDateString(),
					filterable: false
				},
				{
					Header: 'Project Name',
					accessor: 'projectName',
					width: 230,
					Filter: ({ filter, onChange }) => (
						<input
							onChange={event => onChange(event.target.value)}
							value={filter ? filter.value : ''}
							aria-label='Project Name'
						/>
					)
				},
				{
					Header: 'Project Description',
					accessor: 'projectDescription',
					width: 350,
					Filter: ({ filter, onChange }) => (
						<input
							onChange={event => onChange(event.target.value)}
							value={filter ? filter.value : ''}
							aria-label='Project Description'
						/>
					)
				},
				{
					Header: 'Project Type',
					accessor: 'projectType',
					// width: 120,
					Filter: ({ filter, onChange }) => (
						<input
							onChange={event => onChange(event.target.value)}
							value={filter ? filter.value : ''}
							aria-label='Project Type'
						/>
					)
				},
				{
					Header: 'Status',
					accessor: 'id',
					filterable: true,
					width: 100,
					Filter: () => (
						<select
							aria-label='Status'
							onChange={event =>
								handleStatusFilterChange(event.target.value)
							}
							style={{ width: '100%' }}
							value={filter}
						>
							<option value='To Do'>To Do</option>
							<option value='Done'>Done</option>
						</select>
					),
					Cell: row => (
						<div>
							<Link to={`/pipeline-requests/${row.value}`}>
								<Button block color='primary'>
									View
								</Button>
							</Link>
						</div>
					)
				}
			]}
			minRows={5}
			defaultPageSize={20}
			className='-striped -highlight'
			column={{
				...ReactTableDefaults.column,
				headerStyle: { fontWeight: 'bold', textAlign: 'left' }
			}}
			filterable={true}
			loading={loading}
		/>
	);
}
