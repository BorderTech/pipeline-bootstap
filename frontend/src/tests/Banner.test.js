//Example of unit test for a react component - the Banner
import React from "react";
import { shallow, mount } from 'enzyme';
import Banner from '../components/Banner';

describe('Banner', () => {
	it('should render a div', () => {
		expect(shallow(<Banner />).exists(<div className='App'></div>)).toBe(true);
	})

	it('should render a header element', () => {
		expect(shallow(<Banner />).exists(<header className='App-header'></header>)).toBe(true);
	})

	it('should have logo', () => {
		// Disable eslint for A11y as this is testing if the class renders
		expect(shallow(<Banner />).exists(<img className='App-logo' />)).toBe(true); // eslint-disable-line
	})

	it('should have title of level h1', () => {
		// Disable eslint for A11y as this is testing if the class renders
		expect(shallow(<Banner />).exists(<h1 className='App-title'></h1>)).toBe(true); // eslint-disable-line
	})
});

describe('Banner props', () => {
	let props;
	const wrapper = mount(<Banner {...props} />);
	it('should receive and set the application name', () => {
		wrapper.setProps({ name: 'Test app' });
		expect(wrapper.props().name).toEqual('Test app');
		wrapper.unmount();
	})
	it('should receive and set the alternative text for the logo', () => {
		wrapper.setProps({ alttext: 'Description for logo' });
		expect(wrapper.props().alttext).toEqual('Description for logo');
	})
	it('should receive and set the logo', () => {
		wrapper.setProps({ logo: '/path/image.png' });
		expect(wrapper.props().logo).toEqual('/path/image.png');
	})
	 wrapper.unmount();
});




