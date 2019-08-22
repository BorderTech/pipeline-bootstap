import React from 'react';
import { InputFeedback } from './InputFeedback';
import { Input, Label, FormGroup } from 'reactstrap';
import PropTypes from 'prop-types';

export const CheckboxInput = ({
	field: { name, id, value, onChange, onBlur },
	form: { error, touched, setFieldValue },
	label,
	className,
	...props
}) => {
	return (
		<FormGroup check>
			<Label>
				<Input
					name={name}
					id={id}
					type='checkbox'
					value={value}
					checked={value}
					onChange={onChange}
					onBlur={onBlur}
				/>
				{label}
			</Label>
			{touched && <InputFeedback error={error} />}
		</FormGroup>
	);
};

CheckboxInput.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	field: PropTypes.shape({
		name: PropTypes.string,
		onBlur: PropTypes.func,
		onChange: PropTypes.func,
		value: PropTypes.bool
	}),
	form: PropTypes.shape({
		error: PropTypes.string,
		touched: PropTypes.bool,
		setFieldValue: PropTypes.func
	})
};

CheckboxInput.defaultProps = {
	field: { name: '', id: '', label: '', value: false },
	form: { error: '', touched: false }
};
