import React from 'react';
import classNames from 'classnames';

export default function RadioButtonInput({
	field: { name, value, onChange, onBlur },
	id,
	label,
	className,
	...props
}) {
	return (
		<div className='radio'>
			<input
				name={name}
				id={id}
				type='radio'
				value={id}
				checked={id === value}
				onChange={onChange}
				onBlur={onBlur}
				className={classNames('radio-button')}
				{...props}
			/>
			<label htmlFor={id}>{label}</label>
		</div>
	);
}

RadioButtonInput.defaultProps = {
	field: { name: '', value: false },
	id: '',
	label: ''
};
