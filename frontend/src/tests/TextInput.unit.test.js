import React from 'react';
import { shallow, mount } from 'enzyme';
import TextInput from '../components/inputs/TextInput';
import { Input, Label, FormGroup } from 'reactstrap';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('TextInput', () => {
	expect.extend(toHaveNoViolations);

	let props = {
		id: 'TextInput',
		label: 'TextInput'
	};
	it('should not have basic accessibility issues', async () => {
		const html = ReactDOMServer.renderToString(<TextInput {...props} />);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

	it('should render FormGroup div', () => {
		expect(shallow(<TextInput />).find(FormGroup).length).toBe(1);
	});
	it('should render a Label element', () => {
		expect(shallow(<TextInput />).find(Label).length).toBe(1);
	});
	it('should render a Input element', () => {
		expect(shallow(<TextInput />).find(Input).length).toBe(1);
	});
});

describe('TextInput props', () => {
	const onChangeMock = jest.fn();
	let props = {
		handleChange: onChangeMock
	};
	const wrapper = mount(<TextInput {...props} />);
	it('should receive and set the input id', () => {
		wrapper.setProps({ id: 'projectName' });
		expect(wrapper.props().id).toEqual('projectName');
		wrapper.unmount();
	});
	it('should receive and set the input value', () => {
		wrapper.setProps({ value: 'value' });
		expect(wrapper.props().value).toEqual('value');
		wrapper.unmount();
	});
	it('should receive and set the input label', () => {
		wrapper.setProps({ label: 'projectName' });
		expect(wrapper.props().label).toEqual('projectName');
		wrapper.unmount();
	});
	it('should receive and set the input placeholder', () => {
		wrapper.setProps({ placeholder: 'projectName' });
		expect(wrapper.props().placeholder).toEqual('projectName');
		wrapper.unmount();
	});
	it('should receive and set the input text type', () => {
		wrapper.setProps({ type: 'text' });
		expect(wrapper.props().type).toEqual('text');
		wrapper.unmount();
	});
	it('should receive and set the error', () => {
		wrapper.setProps({ error: 'error' });
		expect(wrapper.props().error).toEqual('error');
		wrapper.unmount();
	});
	it('should receive and set the touched state', () => {
		wrapper.setProps({ touched: true });
		expect(wrapper.props().touched).toEqual(true);
		wrapper.unmount();
	});
	it('should receive and set the required state', () => {
		wrapper.setProps({ required: true });
		expect(wrapper.props().required).toEqual(true);
		wrapper.unmount();
	});
	it('should call onChange prop', () => {
		const onChangeMock = jest.fn();
		const event = {
			target: { value: 'the-value' }
		};
		wrapper.setProps({ handleChange: onChangeMock });
		wrapper.find('Input').simulate('change', event);
		expect(onChangeMock).toHaveBeenCalled();
		wrapper.unmount();
	});
	it('should call onBlur prop', () => {
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
