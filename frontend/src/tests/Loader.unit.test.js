import React from 'react';
import { shallow, mount } from 'enzyme';
import Loader from '../components/layout/Loader';

describe('Loader', () => {
	it('should render radio div', () => {
		expect(shallow(<Loader />).find('div.loader').length).toBe(1);
	});
});
