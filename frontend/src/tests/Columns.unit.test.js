import React from 'react';
import { shallow, mount } from 'enzyme';
import Columns from '../components/layout/Columns';

describe('Columns', () => {
	it('should render a row div', () => {
		const wrapper = mount(<Columns />);
		expect(wrapper.find('div.row').length).toBe(1);
	});
	it('should render children props as column div', () => {
		const wrapper = mount(
			<Columns>
				<div id='columnA' />
				<div id='columnB' />
			</Columns>
		);
		expect(wrapper.find('div.col').length).toBe(2);
	});
});
