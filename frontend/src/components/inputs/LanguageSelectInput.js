import React from 'react';
import { Input, Label, FormGroup } from 'reactstrap';
import { ErrorMessage } from 'formik';
import PropTypes from 'prop-types';

export default function LanguageSelectInput({
	value,
	handleChange,
	handleBlur
}) {
	return (
		<FormGroup>
			<Label for='language'>Language / Framework</Label>
			<Input
				type='select'
				name='language'
				id='language'
				value={value}
				onChange={handleChange}
				onBlur={handleBlur}
			>
				<option key='' value='' disabled>
					Select a language / framework
				</option>
				<option key='Java' value='Java'>
					Java
				</option>
				<option key='ReactJS' value='ReactJS'>
					ReactJS
				</option>
				<option key='NodeJS' value='NodeJS'>
					NodeJS
				</option>
				<option key='Other' value='Other'>
					Other
				</option>
			</Input>
			<ErrorMessage
				name='language'
				component='div'
				className='field-error'
			/>
		</FormGroup>
	);
}

LanguageSelectInput.propTypes = {
	value: PropTypes.string,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func
};
