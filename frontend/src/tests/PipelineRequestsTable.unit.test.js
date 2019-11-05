import React from 'react';
import { shallow, mount } from 'enzyme';
import PipelineRequestsTable from '../components/tables/PipelineRequestsTable';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

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

	expect.extend(toHaveNoViolations);

	it('should not have basic accessibility issues', async () => {
		const html = ReactDOMServer.renderToString(
			<Router>
				<PipelineRequestsTable data={data} />
			</Router>
		);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

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
