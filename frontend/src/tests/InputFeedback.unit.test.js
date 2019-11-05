import React from 'react';
import { mount } from 'enzyme';
import { InputFeedback } from '../components/inputs/InputFeedback';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('InputFeedback props', () => {
	let props;
	const wrapper = mount(<InputFeedback {...props} />);

	expect.extend(toHaveNoViolations);

	it('should not have basic accessibility issues', async () => {
		let props = {
			error: 'test error'
		};
		const html = ReactDOMServer.renderToString(
			<InputFeedback {...props} />
		);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

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
