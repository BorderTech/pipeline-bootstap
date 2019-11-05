import React from 'react';
import { shallow, mount } from 'enzyme';
import Columns from '../components/layout/Columns';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('Columns', () => {
	expect.extend(toHaveNoViolations);

	it('should not have basic accessibility issues', async () => {
		const html = ReactDOMServer.renderToString(<Columns />);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

	it('should render a row div', () => {
		const wrapper = mount(<Columns />);
		expect(wrapper.find('div.row').length).toBe(1);
	});
	it('should render children props as column div', () => {
		const wrapper = mount(
			<Columns>
				<div id='columnA' />
				<div id='columnB' />
			</Columns>
		);
		expect(wrapper.find('div.col').length).toBe(2);
	});
});
