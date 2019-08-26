// Renders a header and a welcome message which can be deleted
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import image from './logo-white.svg';
import Banner from './components/layout/Banner';
import { Container } from 'reactstrap';
import Home from './components/pages/Home';
import Create from './components/pages/Create';
import Help from './components/pages/Help';

export default class App extends React.Component {
	render() {
		return (
			<div className='react-app'>
				<Router>
					<Banner
						logo={image}
						name='Pipeline Bootstrap'
						alttext='Department of Home Affairs logo'
					/>
					<Container>
						<Route exact path='/' component={Home} />
						<Route path='/create' component={Create} />
						<Route path='/help' component={Help} />
					</Container>
				</Router>
			</div>
		);
	}
}
