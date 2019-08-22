import React from 'react';
import { shallow, mount } from 'enzyme';
import SoftwareProjectFormInputs from '../components/forms/SoftwareProjectFormInputs';
import LanguageSelectInput from '../components/inputs/LanguageSelectInput';
import { Card, CardBody, Input } from 'reactstrap';
import { Field, Formik } from 'formik';

describe('SoftwareProjectFormInputs', () => {
	it('should render Card element', () => {
		expect(shallow(<SoftwareProjectFormInputs />).find(Card).length).toBe(
			1
		);
	});
	it('should render a CardBody element', () => {
		expect(
			shallow(<SoftwareProjectFormInputs />).find(CardBody).length
		).toBe(1);
	});
	it('should render a Formik Field element', () => {
		expect(shallow(<SoftwareProjectFormInputs />).find(Field).length).toBe(
			1
		);
	});
});

describe('SoftwareProjectFormInputs props', () => {
	it('should receive and set the values ', () => {
		let props;
		// Always need to mount Formik Field inside of a Formik parent.
		const wrapper = mount(
			<Formik>
				<SoftwareProjectFormInputs {...props} />
			</Formik>
		);

		wrapper.setProps({ values: { language: 'language-selection' } });
		expect(wrapper.props().values.language).toEqual('language-selection');
		wrapper.unmount();
	});

	it('should call onChange prop', () => {
		const onChangeMock = jest.fn();
		const event = {
			target: { value: 'the-value' }
		};

		const wrapper = mount(
			<Formik>
				<SoftwareProjectFormInputs handleChange={onChangeMock} />
			</Formik>
		);

		wrapper.find('select#language').simulate('change', event);
		expect(onChangeMock).toHaveBeenCalled();
		wrapper.unmount();
	});

	it('should call onBlur prop', () => {
		const onBlurMock = jest.fn();
		const event = {
			target: { value: 'the-value' }
		};

		const wrapper = mount(
			<Formik>
				<SoftwareProjectFormInputs handleBlur={onBlurMock} />
			</Formik>
		);

		wrapper.find('select#language').simulate('blur', event);
		expect(onBlurMock).toHaveBeenCalled();
		wrapper.unmount();
	});
});
