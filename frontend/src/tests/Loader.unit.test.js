import React from 'react';
import { shallow } from 'enzyme';
import Loader from '../components/layout/Loader';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('Loader', () => {
	expect.extend(toHaveNoViolations);

	it('should not have basic accessibility issues', async () => {
		const html = ReactDOMServer.renderToString(<Loader />);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});
	it('should render radio div', () => {
		expect(shallow(<Loader />).find('div.loader').length).toBe(1);
	});
});
