import React, { Fragment } from 'react';
import { ErrorMessage } from 'formik';
import { Input, Label, FormGroup } from 'reactstrap';
import PropTypes from 'prop-types';

export default function TextInput({
	id,
	label,
	type,
	placeholder,
	value,
	handleChange,
	handleBlur,
	error,
	touched,
	required
}) {
	return (
		<Fragment>
			<FormGroup>
				<Label
					htmlFor={id}
					className={required ? 'required-field' : ''}
				>
					{label}
				</Label>
				<Input
					id={id}
					placeholder={placeholder}
					type={type}
					value={value}
					onChange={handleChange}
					onBlur={handleBlur}
					className={
						error && touched
							? 'text-input is-invalid'
							: 'text-input'
					}
				/>
				<ErrorMessage
					name={id}
					component='div'
					className='field-error'
				/>
			</FormGroup>
		</Fragment>
	);
}

TextInput.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.string,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func,
	error: PropTypes.string,
	touched: PropTypes.bool,
	required: PropTypes.bool
};

TextInput.defaultProps = {
	id: '',
	label: '',
	type: 'text',
	placeholder: '',
	value: ''
};
