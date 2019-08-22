// Renders a header and a welcome message which can be deleted
import React from 'react';
import image from './logo-white.svg';
import Banner from './components/layout/Banner';
import CreateRequestForm from './components/forms/CreateRequestForm';
import { Container } from 'reactstrap';

export default class App extends React.Component {
	render() {
		return (
			<div className='react-app'>
				<Banner
					logo={image}
					name='Pipeline Automation'
					alttext='Department of Home Affairs logo'
				/>
				<Container>
					<CreateRequestForm />
				</Container>
			</div>
		);
	}
}
