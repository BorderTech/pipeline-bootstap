import React, { Component, Fragment } from 'react';
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
import ErrorAlert from '../layout/ErrorAlert';
import Loader from '../layout/Loader';

export class CreateRequestForm extends Component {
	state = {
		formSubmitError: '',
		formSubmitErrorObject: null
	};

	submitForm = async (values, setSubmitting) => {
		try {
			const response = await API.post(
				`pipeline-requests`,
				this.formatSubmission(values)
			);
			// Complete Formik submit and send to the success page
			setSubmitting(false);
			this.props.history.push({
				pathname: `/pipeline-requests/${response.data.id}/success`
			});
		} catch (error) {
			if (error.response) {
				this.setState({
					formSubmitError:
						'Something went wrong creating your request.',
					formSubmitErrorObject: error.response.data
				});
				console.log(error.response.data);
			} else if (error.request) {
				this.setState({
					formSubmitError:
						'Error contacting server. Please contact your systems administrator'
				});
				console.log(error.request);
			} else {
				this.setState({
					formSubmitError:
						'Request error. Please contact your systems administrator'
				});
				console.log('Error', error.message);
			}
		}
		setSubmitting(false);
	};
	formatSubmission(values) {
		// Format object match backend REST API formatting
		let tempValues = { ...values };
		let formattedValues = {};

		if (tempValues.projectType === 'business') {
			formattedValues.businessMetadata = {
				projectManagementRequired: tempValues.projectManagementRequired
			};
		}
		if (tempValues.projectType === 'software') {
			//  CSV formatted projectTechLead to string array
			if (tempValues.projectTechLead) {
				tempValues.projectTechLead = tempValues.projectTechLead
					.trim()
					.split(',');
			}
			// Build the softwareMetadata object for software projects
			formattedValues.softwareMetadata = {
				projectTechLead: tempValues.projectLead,
				kanbanBoardRequired: tempValues.kanbanBoardRequired,
				language: tempValues.language
			};
		}
		// Remove the keys we don't want to merge
		delete tempValues.projectManagementRequired;
		delete tempValues.language;
		delete tempValues.kanbanBoardRequired;
		delete tempValues.projectTechLead;
		// Merge objects into formattedValues for submission
		return { ...formattedValues, ...tempValues };
	}
	render() {
		return (
			<Fragment>
				{/* Unsuccessful form submit */}
				{this.state.formSubmitError ? (
					<ErrorAlert
						message={this.state.formSubmitError}
						errorObject={this.state.formSubmitErrorObject}
					/>
				) : null}

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
							<Fragment>
								{isSubmitting ? (
									<Loader />
								) : (
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
										{/* Requestor */}
										<TextInput
											id='requestor'
											label='Requestor'
											type='text'
											placeholder='Enter requestor name'
											value={values.requestor}
											handleChange={handleChange}
											handleBlur={handleBlur}
											errors={errors.requestor}
											touched={touched.requestor}
											required
										/>
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
												touched={
													touched.projectTechLead
												}
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
								)}
							</Fragment>
						);
					}}
				</Formik>
			</Fragment>
		);
	}
}

export default CreateRequestForm;
