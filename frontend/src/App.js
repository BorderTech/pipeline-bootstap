// Renders a header and a welcome message which can be deleted
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import image from './logo-white.svg';
import BannerWithNav from './components/layout/BannerWithNav';
import { Container } from 'reactstrap';
import Home from './components/pages/Home';
import PipelineRequestCreate from './components/pages/PipelineRequestCreate';
import Help from './components/pages/Help';
import PipelineRequestSuccess from './components/pages/PipelineRequestSuccess';
import PipelineCreateSuccess from './components/pages/PipelineCreateSuccess';
import PipelineRequests from './components/pages/PipelineRequests';
import PipelineRequest from './components/pages/PipelineRequest';
import Login from './components/pages/Login';
import PageNotFound from './components/layout/PageNotFound';
import Footer from './components/layout/Footer';

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<BannerWithNav
					logo={image}
					name='Pipeline Bootstrap'
					alttext='Department of Home Affairs logo'
				/>
				<main className='react-app'>
					<Container>
						<Switch>
							<Route exact path='/' component={Home} />
							<Route path='/help' component={Help} />
							<Route path='/login' component={Login} />
							{/* Pipeline Requests */}
							<Route
								exact
								path='/pipeline-requests'
								component={PipelineRequests}
							/>
							<Route
								exact
								path='/pipeline-requests/create'
								component={PipelineRequestCreate}
							/>
							<Route
								exact
								path='/pipeline-requests/:id/success'
								component={PipelineRequestSuccess}
							/>
							<Route
								exact
								path='/pipeline-requests/:id'
								component={PipelineRequest}
							/>

							{/* Pipelines */}
							<Route
								path='/pipelines/:id/success'
								component={PipelineCreateSuccess}
							/>
							{/* 404 Page not found */}
							<Route component={PageNotFound} />
						</Switch>
					</Container>
				</main>
				<Footer logo={image} />
			</Router>
		);
	}
}
