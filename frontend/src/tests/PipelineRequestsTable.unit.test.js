import React from 'react';
import { shallow, mount } from 'enzyme';
import PipelineRequestsTable from '../components/tables/PipelineRequestsTable';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

describe('ProjectInformationTable', () => {
	const data = [
		{
			requestor: 'ABC123',
			create: '2018-01-01',
			projectName: 'TEST Project',
			projectDescription: 'TEST Project Description',
			projectType: 'software'
		},
		{
			requestor: 'DEF123',
			create: '2018-01-01',
			projectName: 'TEST Project 2',
			projectDescription: 'TEST Project 2 Description',
			projectType: 'software'
		}
	];
	const wrapper = mount(
		<Router>
			<PipelineRequestsTable data={data} />
		</Router>
	);
	it('should render a ReactTable', () => {
		expect(wrapper.find('div.ReactTable').length).toBe(1);
	});

	it('should render a table body where data exists', () => {
		expect(wrapper.find('div.rt-tbody').length).toBe(1);
	});

	it('should render a the correct number of rows to match data prop', () => {
		const oddRowsWithData =
			wrapper.find('div.rt-tr.-odd').length -
			wrapper.find('div.rt-tr.-odd.-padRow').length;
		const evenRowsWithData =
			wrapper.find('div.rt-tr.-even').length -
			wrapper.find('div.rt-tr.-even.-padRow').length;
		const totalRows = oddRowsWithData + evenRowsWithData;
		expect(totalRows).toBe(data.length);
	});
});
