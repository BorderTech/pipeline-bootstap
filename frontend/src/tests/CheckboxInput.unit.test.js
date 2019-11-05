import React from 'react';
import { shallow, mount } from 'enzyme';
import { CheckboxInput } from '../components/inputs/CheckboxInput';
import { Input, Label, FormGroup } from 'reactstrap';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('CheckboxInput', () => {
	it('should render FormGroup div', () => {
		expect(shallow(<CheckboxInput />).find(FormGroup).length).toBe(1);
	});
	it('should render a Label element', () => {
		expect(shallow(<CheckboxInput />).find(Label).length).toBe(1);
	});
	it('should render a Input element', () => {
		expect(shallow(<CheckboxInput />).find(Input).length).toBe(1);
	});
});

describe('CheckboxInput props', () => {
	const onChangeMock = jest.fn();
	let props = {
		field: {
			onChange: onChangeMock
		}
	};
	const wrapper = mount(<CheckboxInput {...props} />);

	expect.extend(toHaveNoViolations);

	it('should not have basic accessibility issues', async () => {
		let props = {
			field: { id: 'checkbodIdOne', name: 'checkbodNameOne' },
			label: 'checkbodIdOne'
		};
		const html = ReactDOMServer.renderToString(
			<CheckboxInput {...props} />
		);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

	it('should receive and set the checkbox id', () => {
		wrapper.setProps({ field: { id: 'checkbodIdOne' } });
		expect(wrapper.props().field.id).toEqual('checkbodIdOne');
		wrapper.unmount();
	});
	it('should receive and set the checkbox label', () => {
		wrapper.setProps({ label: 'isSomethingRequired' });
		expect(wrapper.props().label).toEqual('isSomethingRequired');
		wrapper.unmount();
	});
	it('should receive and set the error', () => {
		wrapper.setProps({ form: { error: 'error' } });
		expect(wrapper.props().form.error).toEqual('error');
		wrapper.unmount();
	});
	it('should receive and set the touched state', () => {
		wrapper.setProps({ form: { touched: true } });
		expect(wrapper.props().form.touched).toEqual(true);
		wrapper.unmount();
	});
	it('should call onChange prop', () => {
		const onChangeMock = jest.fn();
		const event = {
			target: { value: true }
		};
		wrapper.setProps({ field: { onChange: onChangeMock } });
		wrapper.find('Input').simulate('change', event);
		expect(onChangeMock).toHaveBeenCalled();
		wrapper.unmount();
	});
	it('should call onBlur prop', () => {
		const onBlurMock = jest.fn();
		const event = {
			target: { value: true }
		};
		wrapper.setProps({ field: { onBlur: onBlurMock } });
		wrapper.find('Input').simulate('blur', event);
		expect(onBlurMock).toHaveBeenCalled();
		wrapper.unmount();
	});
	wrapper.unmount();
});
