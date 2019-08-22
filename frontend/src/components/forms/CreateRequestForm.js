import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button } from 'reactstrap';
import CreateRequestFormInitialValues from './CreateRequestFormInitialValues';
import { CreateRequestFormValidationSchema } from './CreateRequestFormValidation';
import SoftwareProjectFormInputs from './SoftwareProjectFormInputs';
import RadioButtonInput from '../inputs/RadioButtonInput';
import RadioButtonInputGroup from '../inputs/RadioButtonInputGroup';
import TextInput from '../inputs/TextInput';
import Columns from '../layout/Columns';

export class CreateRequestForm extends Component {
	submitForm(values, setSubmitting) {
		setTimeout(() => {
			// remove software project specific keys
			// from business projects before submit
			if (values.projectType === 'business') {
				delete values.language;
				delete values.kanbanBoardRequired;
			}
			// post submission to backend API
			alert(JSON.stringify(values, null, 2));
			setSubmitting(false);
		}, 500);
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
							<h2>Create Request</h2>
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
									id='business'
									label='Business'
								/>
								<Field
									component={RadioButtonInput}
									name='projectType'
									id='software'
									label='Software'
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
								id='wbsCode'
								label='WBS Code'
								type='text'
								placeholder='Enter your project WBS Code'
								value={values.wbsCode}
								handleChange={handleChange}
								handleBlur={handleBlur}
								errors={errors.projectTechLead}
								touched={touched.projectTechLead}
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
