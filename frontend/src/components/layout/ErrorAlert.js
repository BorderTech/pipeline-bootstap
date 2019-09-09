import React from 'react';
import { Alert } from 'reactstrap';

export default function ErrorAlert({ message }) {
	return <Alert color='danger'>{message}</Alert>;
}
