//Example of unit test for a react component - the Banner
import React from 'react';
import { shallow, mount } from 'enzyme';
import { InputFeedback } from '../components/inputs/InputFeedback';

describe('InputFeedback props', () => {
	let props;
	const wrapper = mount(<InputFeedback {...props} />);
	it('should render nothing if error prop not provided', () => {
		expect(wrapper.find('div.field-error').length).toBe(0);
	});

	it('should render a div if error prop provided', () => {
		wrapper.setProps({ error: 'test error' });
		expect(wrapper.find('div.field-error').length).toBe(1);
		wrapper.unmount();
	});
	it('should receive and set the error', () => {
		wrapper.setProps({ error: 'test error' });
		expect(wrapper.props().error).toEqual('test error');
		wrapper.unmount();
	});
	wrapper.unmount();
});
