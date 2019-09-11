import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button } from 'reactstrap';
import CreateRequestFormInitialValues from './CreateRequestFormInitialValues';
import { CreateRequestFormValidationSchema } from './CreateRequestFormValidation';
import SoftwareProjectFormInputs from './SoftwareProjectFormInputs';
import BusinessProjectFormInputs from './BusinessProjectFormInputs';
import RadioButtonInput from '../inputs/RadioButtonInput';
import RadioButtonInputGroup from '../inputs/RadioButtonInputGroup';
import TextInput from '../inputs/TextInput';
import Columns from '../layout/Columns';
import API from '../../api/api';

export class CreateRequestForm extends Component {
	submitForm = async (values, setSubmitting) => {
		const formattedValues = this.formatSubmission(values);
		console.log(formattedValues);
		try {
			const response = await API.post(
				`pipeline-requests`,
				formattedValues
			);
			// Complete Formik submit and send to the success page
			setSubmitting(false);
			this.props.history.push({
				pathname: '/success',
				state: { id: response.data.id }
			});
		} catch (error) {
			if (error.response) {
				/*
				 * The request was made and the server responded with a
				 * status code that falls out of the range of 2xx
				 */
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				/*
				 * The request was made but no response was received, `error.request`
				 * is an instance of XMLHttpRequest in the browser and an instance
				 * of http.ClientRequest in Node.js
				 */
				console.log(error.request);
			} else {
				// Something happened in setting up the request and triggered an Error
				console.log('Error', error.message);
			}
		}
		setSubmitting(false);
	};
	formatSubmission(values) {
		//  Remove software project specific keys from
		//  business & software projects prior to submission
		let formattedValues = { ...values };
		if (formattedValues.projectType === 'business') {
			delete formattedValues.language;
			delete formattedValues.kanbanBoardRequired;
		}
		if (formattedValues.projectType === 'software') {
			delete formattedValues.projectManagementRequired;
		}

		//  Convert CSV formatted projectTechLead
		//  to string array to pass API validation
		if (formattedValues.projectTechLead) {
			formattedValues.projectTechLead = formattedValues.projectTechLead
				.trim()
				.split(',');
		}
		console.log(formattedValues);
		return formattedValues;
	}
	render() {
		return (
			<Formik
				initialValues={CreateRequestFormInitialValues}
				onSubmit={(values, { setSubmitting }) => {
					this.submitForm(values, setSubmitting);
				}}
				validationSchema={CreateRequestFormValidationSchema}
			>
				{props => {
					const {
						values,
						touched,
						errors,
						dirty,
						isSubmitting,
						handleChange,
						handleBlur,
						handleSubmit,
						handleReset
					} = props;
					return (
						<Form onSubmit={handleSubmit}>
							<h5>Project Options</h5>
							{/* Project Type */}
							<RadioButtonInputGroup
								id='projectType'
								label='Project Type'
								value={values.projectType}
								error={errors.projectType}
								touched={touched.projectType}
							>
								<Field
									component={RadioButtonInput}
									name='projectType'
									id='software'
									label='Software'
								/>
								<Field
									component={RadioButtonInput}
									name='projectType'
									id='business'
									label='Business'
								/>
							</RadioButtonInputGroup>
							{/* Project Name */}
							<TextInput
								id='projectName'
								label='Project Name'
								type='text'
								placeholder='Enter your project name'
								value={values.projectName}
								handleChange={handleChange}
								handleBlur={handleBlur}
								errors={errors.projectName}
								touched={touched.projectName}
								required
							/>
							{/* Project Description */}
							<TextInput
								id='projectDescription'
								label='Project Description'
								type='textarea'
								placeholder='Enter your project description'
								value={values.projectDescription}
								handleChange={handleChange}
								handleBlur={handleBlur}
								errors={errors.projectDescription}
								touched={touched.projectDescription}
								required
							/>
							{/* Project & Tech Lead */}
							<Columns>
								<TextInput
									id='projectLead'
									label='Project Lead'
									type='text'
									placeholder='Enter your project lead'
									value={values.projectLead}
									handleChange={handleChange}
									handleBlur={handleBlur}
									errors={errors.projectLead}
									touched={touched.projectLead}
									required
								/>
								<TextInput
									id='projectTechLead'
									label='Project Tech Lead'
									type='text'
									placeholder='Enter your project tech lead'
									value={values.projectTechLead}
									handleChange={handleChange}
									handleBlur={handleBlur}
									errors={errors.projectTechLead}
									touched={touched.projectTechLead}
								/>
							</Columns>

							{/* WBS Code */}
							<TextInput
								id='orgUnit'
								label='Organisation Unit'
								type='text'
								placeholder='Enter your project Organisation Unit'
								value={values.orgUnit}
								handleChange={handleChange}
								handleBlur={handleBlur}
								errors={errors.orgUnit}
								touched={touched.orgUnit}
								required
							/>

							{/* Org Unit */}
							<TextInput
								id='wbsCode'
								label='WBS Code'
								type='text'
								placeholder='Enter your project WBS Code'
								value={values.wbsCode}
								handleChange={handleChange}
								handleBlur={handleBlur}
								errors={errors.wbsCode}
								touched={touched.wbsCode}
								required
							/>
							{/* Conditionally display software project form options */}
							{values.projectType === 'software' ? (
								<SoftwareProjectFormInputs
									values={values}
									errors={errors}
									touched={touched}
									handleChange={handleChange}
									handleBlur={handleBlur}
								/>
							) : null}
							{/* Conditionally display business project form options */}
							{values.projectType === 'business' ? (
								<BusinessProjectFormInputs
									values={values}
									errors={errors}
									touched={touched}
									handleChange={handleChange}
									handleBlur={handleBlur}
								/>
							) : null}

							{/* Submit & Reset buttons */}
							<Button
								type='button'
								color='secondary'
								onClick={handleReset}
								disabled={!dirty || isSubmitting}
							>
								Reset
							</Button>
							<Button
								color='primary'
								type='submit'
								disabled={isSubmitting}
							>
								Submit
							</Button>
						</Form>
					);
				}}
			</Formik>
		);
	}
}

export default CreateRequestForm;
