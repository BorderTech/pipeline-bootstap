import React, { Component, Fragment } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export class Home extends Component {
	render() {
		return (
			<Fragment>
				{/* <h2>Pipeline Bootstrap</h2> */}
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
					do eiusmod tempor incididunt ut labore et dolore magna
					aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
				<p>
					Duis aute irure dolor in reprehenderit in voluptate velit
					esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
					occaecat cupidatat non proident, sunt in culpa qui officia
					deserunt mollit anim id est laborum."
				</p>
				<Link to='/pipeline-requests/create'>
					<Button color='primary'>Create Request</Button>
				</Link>
				<Link to='/pipeline-requests'>
					<Button color='primary'>View Requests</Button>
				</Link>
			</Fragment>
		);
	}
}

export default Home;
