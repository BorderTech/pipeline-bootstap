import React from 'react';
import { shallow, mount } from 'enzyme';
import ArtefactsInformationTable from '../components/tables/ArtefactsInformationTable';
import { Table } from 'reactstrap';

describe('ArtefactsInformationTable', () => {
	const artefacts = [
		{
			id: 1,
			type: 'Jira',
			name: 'TEST Project 1',
			url: 'www.example.com/Jira'
		},
		{
			id: 2,
			type: 'Confluence',
			name: 'TEST Project 1',
			url: 'www.example.com/Confluence'
		},
		{
			id: 3,
			type: 'Bitbucket',
			name: 'TEST Project 1',
			url: 'www.example.com/Bitbucket'
		},
		{
			id: 4,
			type: 'Jenkins',
			name: 'TEST Project 1',
			url: 'www.example.com/Jenkins'
		}
	];
	const wrapper = mount(<ArtefactsInformationTable artefacts={artefacts} />);
	it('should render a ReactTable', () => {
		expect(wrapper.find(Table).length).toBe(1);
	});

	it('should render a table body where data exists', () => {
		expect(wrapper.find('tbody').length).toBe(artefacts.length);
	});

	it('should render a the correct number of rows to match artefacts prop', () => {
		expect(wrapper.find('tbody tr').length).toBe(artefacts.length * 2);
	});
});
