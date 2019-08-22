import React from 'react';
import { Field } from 'formik';
import { shallow, mount } from 'enzyme';
import { FormGroup, Label } from 'reactstrap';
import RadioButtonInputGroup from '../components/inputs/RadioButtonInputGroup';
import RadioButtonInput from '../components/inputs/RadioButtonInput';

describe('RadioButtonInput', () => {
	it('should render FormGroup div', () => {
		expect(shallow(<RadioButtonInputGroup />).find(FormGroup).length).toBe(
			1
		);
	});
	it('should render a fieldset element', () => {
		expect(shallow(<RadioButtonInputGroup />).find('fieldset').length).toBe(
			1
		);
	});
	it('should render a legend element', () => {
		expect(shallow(<RadioButtonInputGroup />).find('legend').length).toBe(
			1
		);
	});
});

describe('RadioButtonInput props', () => {
	let props;
	const wrapper = mount(<RadioButtonInputGroup {...props} />);
	it('should receive and set the radio button group id', () => {
		wrapper.setProps({ id: 'radioButtonGroupIdOne' });
		expect(wrapper.props().id).toEqual('radioButtonGroupIdOne');
		wrapper.unmount();
	});
	it('should receive and set the radio button group value', () => {
		wrapper.setProps({ value: 'value' });
		expect(wrapper.props().value).toEqual('value');
		wrapper.unmount();
	});
	it('should receive and set the radio button group label', () => {
		wrapper.setProps({ label: 'label' });
		expect(wrapper.props().label).toEqual('label');
		wrapper.unmount();
	});
	it('should receive and set the radio button group touched', () => {
		wrapper.setProps({ touched: true });
		expect(wrapper.props().touched).toEqual(true);
		wrapper.unmount();
	});

	it('should render children formik field props radio buttons', () => {
		const wrapper = shallow(
			<RadioButtonInputGroup>
				<Field
					component={RadioButtonInput}
					name='projectType'
					id='business'
					label='Business'
				/>
				<Field
					component={RadioButtonInput}
					name='projectType'
					id='software'
					label='Software'
				/>
			</RadioButtonInputGroup>
		);
		expect(wrapper.find(Field).length).toBe(2);
	});

	wrapper.unmount();
});
