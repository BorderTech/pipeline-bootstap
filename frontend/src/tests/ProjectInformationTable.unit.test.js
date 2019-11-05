import React from 'react';
import { shallow, mount } from 'enzyme';
import ProjectInformationTable from '../components/tables/ProjectInformationTable';
import { Table } from 'reactstrap';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('ProjectInformationTable', () => {
	expect.extend(toHaveNoViolations);

	it('should not have basic accessibility issues', async () => {
		let props = {
			requestor: 'ABC123',
			created: '2018-01-01',
			projectName: 'Test Project',
			projectDescription: 'Test Proj Desc',
			projectType: 'business',
			projectLead: 'ABC123',
			projectTechLead: 'ABC123',
			orgUnit: 'TEST',
			wbsCode: '12345'
		};
		const html = ReactDOMServer.renderToString(
			<ProjectInformationTable {...props} />
		);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

	const wrapper = shallow(<ProjectInformationTable />);
	it('should render a Table', () => {
		expect(wrapper.find(Table).length).toBe(1);
	});

	it('should render a table header element', () => {
		expect(wrapper.find('thead th').text()).toEqual('Project Information');
	});

	it('should render the project information rows', () => {
		expect(wrapper.find('tr#requestor').length).toBe(1);
		expect(wrapper.find('tr#date').length).toBe(1);
		expect(wrapper.find('tr#name').length).toBe(1);
		expect(wrapper.find('tr#description').length).toBe(1);
		expect(wrapper.find('tr#projectLead').length).toBe(1);
		expect(wrapper.find('tr#techLead').length).toBe(1);
		expect(wrapper.find('tr#orgUnit').length).toBe(1);
		expect(wrapper.find('tr#wbsCode').length).toBe(1);
	});
});

describe('ProjectInformationTable props', () => {
	let props;
	const wrapper = mount(<ProjectInformationTable {...props} />);
	it('should receive and set the requestor', () => {
		wrapper.setProps({ requestor: 'ABC123' });
		expect(wrapper.props().requestor).toEqual('ABC123');
		wrapper.unmount();
	});

	it('should receive and set the created date', () => {
		wrapper.setProps({ created: '2018-01-01' });
		expect(wrapper.props().created).toEqual('2018-01-01');
		wrapper.unmount();
	});

	it('should receive and set the project name', () => {
		wrapper.setProps({ projectName: 'Test Project' });
		expect(wrapper.props().projectName).toEqual('Test Project');
		wrapper.unmount();
	});

	it('should receive and set the project description', () => {
		wrapper.setProps({ projectDescription: 'Test Proj Desc' });
		expect(wrapper.props().projectDescription).toEqual('Test Proj Desc');
		wrapper.unmount();
	});

	it('should receive and set the project type', () => {
		wrapper.setProps({ projectType: 'business' });
		expect(wrapper.props().projectType).toEqual('business');
		wrapper.unmount();
	});

	it('should receive and set the projectLead', () => {
		wrapper.setProps({ projectLead: 'ABC123' });
		expect(wrapper.props().projectLead).toEqual('ABC123');
		wrapper.unmount();
	});

	it('should receive and set the projectTechLead', () => {
		wrapper.setProps({ projectTechLead: 'ABC123' });
		expect(wrapper.props().projectTechLead).toEqual('ABC123');
		wrapper.unmount();
	});

	it('should receive and set the orgUnit', () => {
		wrapper.setProps({ orgUnit: 'TEST' });
		expect(wrapper.props().orgUnit).toEqual('TEST');
		wrapper.unmount();
	});

	it('should receive and set the wbsCode', () => {
		wrapper.setProps({ wbsCode: '12345' });
		expect(wrapper.props().wbsCode).toEqual('12345');
		wrapper.unmount();
	});
	wrapper.unmount();
});
