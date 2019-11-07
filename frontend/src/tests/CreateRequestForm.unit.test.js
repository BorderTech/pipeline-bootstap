import React from 'react';
import { shallow, mount } from 'enzyme';
import CreateRequestForm from '../components/forms/CreateRequestForm';
import RadioButtonInputGroup from '../components/inputs/RadioButtonInputGroup';
import { Field, Formik, Form } from 'formik';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('CreateRequestForm', () => {
	expect.extend(toHaveNoViolations);
	let props = {};
	const wrapper = mount(<CreateRequestForm {...props} />);

	it('should not have basic accessibility issues', async () => {
		const html = ReactDOMServer.renderToString(<CreateRequestForm />);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

	it('should render Formik element', () => {
		expect(wrapper.find(Formik).length).toBe(1);
	});
	it('should render a Form element', () => {
		expect(wrapper.find(Form).length).toBe(1);
	});
	it('should render a the projectType RadioButtonInputGroup', () => {
		expect(wrapper.find(RadioButtonInputGroup).length).toBe(1);
	});

	it('should render a the requestor text input', () => {
		expect(wrapper.find('input#requestor').length).toBe(1);
	});

	it('should render a the projectName text input', () => {
		expect(wrapper.find('input#projectName').length).toBe(1);
	});

	it('should render a the projectDescription text input', () => {
		expect(wrapper.find('textarea#projectDescription').length).toBe(1);
	});

	it('should render a the projectTechLead text input', () => {
		expect(wrapper.find('input#projectTechLead').length).toBe(1);
	});

	it('should render a the orgUnit text input', () => {
		expect(wrapper.find('input#orgUnit').length).toBe(1);
	});

	it('should render a the wbsCode text input', () => {
		expect(wrapper.find('input#wbsCode').length).toBe(1);
	});
});

const updateField = (wrapper, name, value) => {
	wrapper.simulate('change', {
		persist: () => {},
		target: {
			name,
			value
		}
	});
};

const wait = timeout => {
	return new Promise(function(resolve, reject) {
		setTimeout(() => resolve(), timeout);
	});
};

describe('CreateRequestForm validation', () => {
	let wrapper;

	beforeEach(async () => {
		wrapper = mount(<CreateRequestForm />);
	});

	afterEach(() => {
		wrapper.unmount();
	});

	it('Should update requestor input field on change', () => {
		updateField(wrapper.find('input#requestor'), 'requestor', 'ABC123');
		expect(wrapper.find('input#requestor').props().value).toEqual('ABC123');
	});

	it('Should show error with invalid requestor ID input field on blur', async () => {
		const errorMessage = 'A project name is required.';
		const field = wrapper.find('input#projectName');
		field.simulate('focus');
		updateField(field, 'projectName', '');
		field.simulate('blur', {
			target: { name: 'projectName', value: '' }
		});
		await wait(1000);
		wrapper.update();

		const updatedField = wrapper.find({
			id: 'projectName',
			type: 'text',
			touched: true
		});
		expect(updatedField.props().value).toEqual('');
		expect(updatedField.props().errors).toEqual(errorMessage);
	});
});
