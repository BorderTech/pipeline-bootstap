import React from 'react';
import { shallow, mount } from 'enzyme';
import RadioButtonInput from '../components/inputs/RadioButtonInput';

describe('RadioButtonInput', () => {
	it('should render radio div', () => {
		expect(shallow(<RadioButtonInput />).find('div.radio').length).toBe(1);
	});
	it('should render a Label element', () => {
		expect(shallow(<RadioButtonInput />).find('label').length).toBe(1);
	});
	it('should render a Input element', () => {
		expect(shallow(<RadioButtonInput />).find('input').length).toBe(1);
	});
});

describe('RadioButtonInput props', () => {
	const onChangeMock = jest.fn();
	let props = {
		field: {
			onChange: onChangeMock
		}
	};
	const wrapper = mount(<RadioButtonInput {...props} />);
	it('should receive and set the radio button id', () => {
		wrapper.setProps({ field: { id: 'radioButtonIdOne' } });
		expect(wrapper.props().field.id).toEqual('radioButtonIdOne');
		wrapper.unmount();
	});
	it('should receive and set the radio button label', () => {
		wrapper.setProps({
			field: {
				onChange: onChangeMock
			},
			label: 'radioButtonLabel'
		});
		expect(wrapper.props().label).toEqual('radioButtonLabel');
		wrapper.unmount();
	});
	it('should call onChange prop', () => {
		const event = {
			target: { value: true }
		};
		wrapper.setProps({ field: { onChange: onChangeMock } });
		wrapper.find('input').simulate('change', event);
		expect(onChangeMock).toHaveBeenCalled();
		wrapper.unmount();
	});
	it('should call onBlur prop', () => {
		const onBlurMock = jest.fn();
		const onChangeMock = jest.fn();
		const event = {
			target: { value: true }
		};
		wrapper.setProps({
			field: { onBlur: onBlurMock, onChange: onChangeMock }
		});
		wrapper.find('input').simulate('blur', event);
		expect(onBlurMock).toHaveBeenCalled();
		wrapper.unmount();
	});
});
