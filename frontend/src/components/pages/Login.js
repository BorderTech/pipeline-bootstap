import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import TextInput from '../inputs/TextInput';
import * as Yup from 'yup';
import { Button } from 'reactstrap';

export class Login extends Component {
	submitForm = async (values, setSubmitting) => {
		try {
			alert(JSON.stringify(values, null, 4));
			// Complete Formik submit and send to the success page
			setSubmitting(false);
		} catch (error) {
			console.log(error);
		}
		setSubmitting(false);
	};
	render() {
		return (
			<Formik
				initialValues={{
					email: '',
					password: ''
				}}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email('Email is invalid')
						.required('Email is required'),
					password: Yup.string().required('Password is required')
				})}
				onSubmit={(values, { setSubmitting }) => {
					this.submitForm(values, setSubmitting);
				}}
				render={({
					errors,
					status,
					dirty,
					isSubmitting,
					handleReset,
					touched,
					values,
					handleChange,
					handleBlur
				}) => (
					<Form>
						<h2>Login</h2>
						{/* Email */}
						<TextInput
							id='email'
							label='Email'
							type='text'
							placeholder='Enter email address'
							value={values.email}
							handleChange={handleChange}
							handleBlur={handleBlur}
							errors={errors.email}
							touched={touched.email}
							required
						/>

						{/* Password */}
						<TextInput
							id='password'
							label='Password'
							type='password'
							placeholder='Enter password'
							value={values.password}
							handleChange={handleChange}
							handleBlur={handleBlur}
							errors={errors.password}
							touched={touched.password}
							required
						/>
						{/* Login Button */}
						<Button
							color='primary'
							type='submit'
							disabled={isSubmitting}
						>
							Login
						</Button>
					</Form>
				)}
			/>
		);
	}
}

export default Login;
