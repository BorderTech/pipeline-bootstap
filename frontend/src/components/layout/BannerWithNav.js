import React, { useState } from 'react';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink
} from 'reactstrap';
import '../../styles/css/banner.css';
import DepartmentLogo from '../../logo-white.svg';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

export default function BannerWithNav({ name, logo, alttext }) {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	return (
		<header className='header'>
			<Container>
				<Navbar light expand='md'>
					<NavbarBrand href='/'>
						<h1>Pipeline Bootstrap</h1>
					</NavbarBrand>
					<NavbarToggler onClick={toggle} />
					<Collapse isOpen={isOpen} navbar>
						<Nav className='ml-auto' navbar>
							<NavItem>
								<NavLink href='/pipeline-requests/create'>
									Create Request
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href='/pipeline-requests'>
									View Requests
								</NavLink>
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
			</Container>
		</header>
	);
}

BannerWithNav.propTypes = {
	name: PropTypes.string,
	logo: PropTypes.string,
	alttext: PropTypes.string
};

BannerWithNav.defaultProps = {
	name: 'BorderTech React Boilerplate',
	logo: DepartmentLogo,
	alttext: 'Department of Home Affairs logo'
};
