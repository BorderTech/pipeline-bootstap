import React from 'react';
import { shallow, mount } from 'enzyme';
import BitbucketInformationTable from '../components/tables/BitbucketInformationTable';
import { Table } from 'reactstrap';

describe('BitbucketInformationTable', () => {
	const wrapper = shallow(<BitbucketInformationTable />);
	it('should render a Table', () => {
		expect(wrapper.find(Table).length).toBe(1);
	});

	it('should render a table header element', () => {
		expect(wrapper.find('thead th').text()).toEqual(
			'Bitbucket Information'
		);
	});

	it('should render a language row', () => {
		expect(wrapper.find('tr#language').length).toBe(1);
	});
});

describe('BitbucketInformationTable props', () => {
	let props;
	const wrapper = mount(<BitbucketInformationTable {...props} />);
	it('should receive and set the bitbucket name', () => {
		wrapper.setProps({ language: 'Java' });
		expect(wrapper.props().language).toEqual('Java');
		wrapper.unmount();
	});
	wrapper.unmount();
});
