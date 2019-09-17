import React, { Fragment } from 'react';
import { Card, CardTitle, CardBody } from 'reactstrap';
import { CheckboxInput } from '../inputs/CheckboxInput';
import { Field } from 'formik';
import PropTypes from 'prop-types';

export default function BusinessProjectFormInputs({
	values,
	handleChange,
	handleBlur
}) {
	return (
		<Fragment>
			<Card
				style={{
					backgroundColor: '#fff',
					borderColor: '#333',
					marginBottom: '10px'
				}}
			>
				{/* Project management required */}
				<CardBody>
					<CardTitle>Business Project Options</CardTitle>
					<Field
						component={CheckboxInput}
						name='projectManagementRequired'
						id='projectManagementRequired'
						label='Project Management Required?'
					/>
				</CardBody>
			</Card>
		</Fragment>
	);
}

BusinessProjectFormInputs.propTypes = {
	values: PropTypes.object,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func
};
