import React from 'react';
import DepartmentLogo from '../../logo-white.svg';
import PropTypes from 'prop-types';

export default function Footer({ logo, alttext }) {
	return (
		<footer className='text-center'>
			<img
				style={{ height: '50px', display: 'inline', marginTop: '0' }}
				src={logo}
				className='App-logo'
				alt={alttext}
			/>
		</footer>
	);
}

Footer.propTypes = {
	logo: PropTypes.string,
	alttext: PropTypes.string
};

Footer.defaultProps = {
	logo: DepartmentLogo,
	alttext: 'Department of Home Affairs logo'
};
