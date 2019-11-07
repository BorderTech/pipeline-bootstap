import React from 'react';
import { shallow, mount } from 'enzyme';
import BusinessProjectFormInputs from '../components/forms/BusinessProjectFormInputs';
import { Card, CardBody } from 'reactstrap';
import { Field, Formik } from 'formik';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('BusinessProjectFormInputs', () => {
	expect.extend(toHaveNoViolations);

	it('should not have basic accessibility issues', async () => {
		const html = ReactDOMServer.renderToString(
			<BusinessProjectFormInputs />
		);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

	it('should render Card element', () => {
		expect(shallow(<BusinessProjectFormInputs />).find(Card).length).toBe(
			1
		);
	});
	it('should render a CardBody element', () => {
		expect(
			shallow(<BusinessProjectFormInputs />).find(CardBody).length
		).toBe(1);
	});
	it('should render a Formik Field element', () => {
		expect(shallow(<BusinessProjectFormInputs />).find(Field).length).toBe(
			1
		);
	});
});
