import React, { useState } from 'react';
import {
	Alert,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Row,
	Col
} from 'reactstrap';

export default function ErrorAlert({ message, errorObject }) {
	return (
		<Alert color='danger'>
			<Row>
				<Col xs='9'>{message}</Col>
				<Col xs='3' className={'text-right'}>
					{errorObject ? (
						<ViewErrorModal
							buttonLabel={'View Error'}
							errorObject={errorObject}
						/>
					) : null}
				</Col>
			</Row>
		</Alert>
	);
}

const ViewErrorModal = props => {
	const { buttonLabel, className, errorObject } = props;
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

	return (
		<div>
			<Button color='danger' size={'sm'} onClick={toggle}>
				{buttonLabel}
			</Button>
			<Modal
				size={'lg'}
				isOpen={modal}
				toggle={toggle}
				className={className}
			>
				<ModalHeader toggle={toggle}>Error Message</ModalHeader>
				<ModalBody>
					<PrettyPrintJson data={errorObject}></PrettyPrintJson>
				</ModalBody>
				<ModalFooter>
					<Button color='secondary' onClick={toggle}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

const PrettyPrintJson = ({ data }) => {
	return (
		<div>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};
