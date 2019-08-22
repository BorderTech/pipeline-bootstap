import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export const InputFeedback = ({ error }) =>
	error ? <div className={classNames('field-error')}>{error}</div> : null;

InputFeedback.propTypes = {
	error: PropTypes.string
};
