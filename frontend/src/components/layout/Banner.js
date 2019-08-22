import React from 'react';
import '../../styles/css/banner.css';
import DepartmentLogo from '../../logo-white.svg';
import PropTypes from 'prop-types';

export default function Banner({ name, logo, alttext }) {
	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt={alttext} />
				<h1 className='App-title'>{name}</h1>
			</header>
		</div>
	);
}

Banner.propTypes = {
	name: PropTypes.string,
	logo: PropTypes.string,
	alttext: PropTypes.string
};

Banner.defaultProps = {
	name: 'BorderTech React Boilerplate',
	logo: DepartmentLogo,
	alttext: 'Department of Home Affairs logo'
};
