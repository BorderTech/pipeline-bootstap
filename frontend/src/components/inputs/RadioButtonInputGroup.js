import React from 'react';
import classNames from 'classnames';
import { InputFeedback } from './InputFeedback';
import { FormGroup } from 'reactstrap';
import PropTypes from 'prop-types';

export default function RadioButtonInputGroup({
	value,
	error,
	touched,
	id,
	label,
	className,
	children
}) {
	const classes = classNames(
		'input-field radio-group',
		{
			'is-success': value || (!error && touched), // handle pre-filled or user-filled
			'is-error': !!error && touched
		},
		className
	);

	return (
		<FormGroup id={id} className={classes}>
			{/* <div>{label}</div> */}
			<fieldset className='border p-2'>
				<legend className='w-auto'>{label}</legend>
				{children}
				{touched && <InputFeedback error={error} />}
			</fieldset>
		</FormGroup>
	);
}

RadioButtonInputGroup.propTypes = {
	value: PropTypes.string,
	error: PropTypes.object,
	touched: PropTypes.bool,
	id: PropTypes.string,
	label: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.array
};
