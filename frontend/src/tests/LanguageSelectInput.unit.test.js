import React from 'react';
import { shallow, mount } from 'enzyme';
import { FormGroup, Label, Input } from 'reactstrap';
import LanguageSelectInput from '../components/inputs/LanguageSelectInput';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('LanguageSelectInput', () => {
	expect.extend(toHaveNoViolations);

	it('should not have basic accessibility issues', async () => {
		const html = ReactDOMServer.renderToString(<LanguageSelectInput />);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

	it('should render FormGroup div', () => {
		expect(shallow(<LanguageSelectInput />).find(FormGroup).length).toBe(1);
	});
	it('should render a label element', () => {
		expect(shallow(<LanguageSelectInput />).find(Label).length).toBe(1);
	});
	it('should render a input element', () => {
		expect(shallow(<LanguageSelectInput />).find(Input).length).toBe(1);
	});
	it('should render a four option elements', () => {
		expect(shallow(<LanguageSelectInput />).find('option').length).toBe(5);
	});
});

describe('LanguageSelectInput props', () => {
	const onChangeMock = jest.fn();
	let props = {
		handleChange: onChangeMock
	};
	const wrapper = mount(<LanguageSelectInput {...props} />);
	it('should receive and set the select value', () => {
		wrapper.setProps({ value: 'value' });
		expect(wrapper.props().value).toEqual('value');
		wrapper.unmount();
	});
	it('should call handleChange prop', () => {
		const onChangeMock = jest.fn();
		const event = {
			target: { value: 'the-value' }
		};
		wrapper.setProps({ handleChange: onChangeMock });
		wrapper.find('Input').simulate('change', event);
		expect(onChangeMock).toHaveBeenCalled();
		wrapper.unmount();
	});
	it('should call handleBlur prop', () => {
		const onBlurMock = jest.fn();
		const event = {
			target: { value: 'the-value' }
		};
		wrapper.setProps({ handleBlur: onBlurMock });
		wrapper.find('Input').simulate('blur', event);
		expect(onBlurMock).toHaveBeenCalled();
		wrapper.unmount();
	});
});
