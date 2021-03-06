import React from 'react';
import { shallow, mount } from 'enzyme';
import JiraInformationTable from '../components/tables/JiraInformationTable';
import { Table } from 'reactstrap';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('JiraInformationTable', () => {
	expect.extend(toHaveNoViolations);

	it('should not have basic accessibility issues', async () => {
		const html = ReactDOMServer.renderToString(<JiraInformationTable />);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

	const wrapper = shallow(<JiraInformationTable projectType='' />);
	it('should render a Table', () => {
		expect(wrapper.find(Table).length).toBe(1);
	});

	it('should render a table header element', () => {
		expect(wrapper.find('thead th').text()).toEqual('Jira Information');
	});

	it('should render a language row', () => {
		wrapper.setProps({ projectType: 'software' });
		expect(wrapper.find('tr#projectType').length).toBe(1);

		wrapper.setProps({ projectType: 'business' });
		expect(wrapper.find('tr#projectType').length).toBe(1);
	});
});

describe('JiraInformationTable props', () => {
	let props;
	const wrapper = mount(<JiraInformationTable {...props} />);
	it('should receive and set the project type', () => {
		wrapper.setProps({ projectType: 'business' });
		expect(wrapper.props().projectType).toEqual('business');

		wrapper.setProps({ projectType: 'software' });
		expect(wrapper.props().projectType).toEqual('software');
		wrapper.unmount();
	});

	it('should receive and set the kanbanBoardRequired', () => {
		wrapper.setProps({ kanbanBoardRequired: true });
		expect(wrapper.props().kanbanBoardRequired).toEqual(true);
		wrapper.unmount();
	});

	it('should receive and set the project type', () => {
		wrapper.setProps({ projectManagementRequired: true });
		expect(wrapper.props().projectManagementRequired).toEqual(true);
		wrapper.unmount();
	});
	wrapper.unmount();
});
