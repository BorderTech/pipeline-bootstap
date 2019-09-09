import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import API from '../../api/api';

export class Success extends Component {
	async componentDidMount() {
		const { id } = this.props.location.state;
		const response = await API.get(`pipeline-requests/${id}`);
		console.log(response.data);
	}
	render() {
		const { id } = this.props.location.state;
		return (
			<Fragment>
				<h2>Success</h2>
				<h3>Your request has been submitted successfully.</h3>
				<h4>You can track your progress here:</h4>
				<h5> Jira Issue: {id}</h5>
				<Link to='/create'>
					<Button color='primary'>Create New Request</Button>
				</Link>
			</Fragment>
		);
	}
}

export default Success;
