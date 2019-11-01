import React from 'react';
import { shallow, mount } from 'enzyme';
import ConfluenceInformationTable from '../components/tables/ConfluenceInformationTable';
import { Table } from 'reactstrap';

describe('ConfluenceInformationTable', () => {
	const wrapper = shallow(<ConfluenceInformationTable />);
	it('should render a Table', () => {
		expect(wrapper.find(Table).length).toBe(1);
	});

	it('should render a table header element', () => {
		expect(wrapper.find('thead th').text()).toEqual(
			'Confluence Information'
		);
	});

	it('should render a language row', () => {
		expect(wrapper.find('tr#spaceType').length).toBe(1);
	});
});

describe('ConfluenceInformationTable props', () => {
	let props;
	const wrapper = mount(<ConfluenceInformationTable {...props} />);
	it('should receive and set the space name', () => {
		wrapper.setProps({ spaceType: 'Basic' });
		expect(wrapper.props().spaceType).toEqual('Basic');
		wrapper.unmount();
	});
	wrapper.unmount();
});
