import React from 'react';
import '../../styles/css/banner.css';
import DepartmentLogo from '../../logo-white.svg';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

export default function Banner({ name, logo, alttext }) {
	return (
		<header className='App-header'>
			<Container>
				<img src={logo} className='App-logo' alt={alttext} />
				<h1 className='App-title'>{name}</h1>
			</Container>
		</header>
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
