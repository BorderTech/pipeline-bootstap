import React from 'react';
import { Row, Col } from 'reactstrap';

export default function Columns({ children }) {
	return (
		<Row>
			{children
				? children.map((child, i) => <Col key={i}>{child}</Col>)
				: null}
		</Row>
	);
}
