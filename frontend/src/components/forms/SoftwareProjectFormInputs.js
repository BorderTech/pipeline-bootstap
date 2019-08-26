import React, { Fragment } from 'react';
import { Card, CardTitle, CardBody } from 'reactstrap';
import LanguageSelectInput from '../inputs/LanguageSelectInput';
import { CheckboxInput } from '../inputs/CheckboxInput';
import { Field } from 'formik';
import PropTypes from 'prop-types';

export default function SoftwareProjectFormInputs({
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
				{/* Projct Language / Framework */}
				<CardBody>
					<CardTitle>Software Development Project Options</CardTitle>
					<LanguageSelectInput
						value={values.language}
						handleChange={handleChange}
						handleBlur={handleBlur}
					/>
					{/* Kanban Board */}
					<Field
						component={CheckboxInput}
						name='kanbanBoardRequired'
						id='kanbanBoardRequired'
						label='Kanban Board Required?'
					/>
				</CardBody>
			</Card>
		</Fragment>
	);
}

SoftwareProjectFormInputs.propTypes = {
	values: PropTypes.object,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func
};

SoftwareProjectFormInputs.defaultProps = {
	values: {
		language: ''
	}
};
