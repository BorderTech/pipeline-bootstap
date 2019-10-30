import React from 'react';
import { shallow, mount } from 'enzyme';
import ErrorAlert from '../components/layout/ErrorAlert';

describe('ErrorAlert', () => {
	const errorMessage = 'Test Error Message';
	const errorObject = { error: 'some detailed error object' };
	it('should render a alert div', () => {
		expect(
			mount(<ErrorAlert message={errorMessage} />).find(
				'div.alert.alert-danger'
			).length
		).toBe(1);
	});

	it('should render error message  div', () => {
		expect(
			mount(<ErrorAlert message={errorMessage} />).find('div.col-9')
				.length
		).toBe(1);
	});

	it('should NOT render view error button if errorObject is not provided', () => {
		expect(
			mount(<ErrorAlert message={errorMessage} />).find('button').length
		).toBe(0);
	});

	it('should render view error button if errorObject provided', () => {
		expect(
			mount(
				<ErrorAlert message={errorMessage} errorObject={errorObject} />
			).find('button').length
		).toBe(1);
	});
});

describe('ErrorAlert props', () => {
	let props = {};
	const wrapper = mount(<ErrorAlert {...props} />);
	it('should receive and set the error message', () => {
		wrapper.setProps({ message: 'Test error message' });
		expect(wrapper.props().message).toEqual('Test error message');
		wrapper.unmount();
	});

	it('should receive and set the error object', () => {
		wrapper.setProps({
			errorObject: { error: 'some detailed error object' }
		});
		expect(wrapper.props().errorObject).toEqual({
			error: 'some detailed error object'
		});
		wrapper.unmount();
	});
});
