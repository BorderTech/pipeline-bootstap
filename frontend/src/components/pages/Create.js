import React, { Component, Fragment } from 'react';
import CreateRequestForm from '../forms/CreateRequestForm';

export class Create extends Component {
	render() {
		return (
			<Fragment>
				<h2>Create Request</h2>
				<CreateRequestForm />
			</Fragment>
		);
	}
}

export default Create;
