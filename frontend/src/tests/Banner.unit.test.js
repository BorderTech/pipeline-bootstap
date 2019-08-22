//Example of unit test for a react component - the Banner
import React from 'react';
import { shallow, mount } from 'enzyme';
import Banner from '../components/layout/Banner';

describe('Banner', () => {
	it('should render a div', () => {
		expect(shallow(<Banner />).find('div.App').length).toBe(1);
	});

	it('should render a header element', () => {
		expect(shallow(<Banner />).find('header.App-header').length).toBe(1);
	});

	it('should have logo', () => {
		expect(shallow(<Banner />).find('img.App-logo').length).toBe(1);
	});

	it('should have title of level h1', () => {
		expect(shallow(<Banner />).find('h1.App-title').length).toBe(1);
	});
});

describe('Banner props', () => {
	let props;
	const wrapper = mount(<Banner {...props} />);
	it('should receive and set the application name', () => {
		wrapper.setProps({ name: 'Test app' });
		expect(wrapper.props().name).toEqual('Test app');
		wrapper.unmount();
	});
	it('should receive and set the alternative text for the logo', () => {
		wrapper.setProps({ alttext: 'Description for logo' });
		expect(wrapper.props().alttext).toEqual('Description for logo');
	});
	it('should receive and set the logo', () => {
		wrapper.setProps({ logo: '/path/image.png' });
		expect(wrapper.props().logo).toEqual('/path/image.png');
	});
	wrapper.unmount();
});
