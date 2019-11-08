import * as Yup from 'yup';

export const CreateRequestFormValidationSchema = Yup.object().shape({
	requestor: Yup.string().required('A requestor is required.'),
	projectType: Yup.string().required('A project type is required.'),
	projectName: Yup.string().required('A project name is required.'),
	projectDescription: Yup.string().required(
		'A project description is required.'
	),
	projectLead: Yup.string()
		.required('A project lead is required.')
		.matches(/^[A-Za-z0-9]{6}$/, {
			// Matches Departmental UserID
			message: 'Incorrect format. Example ABC123'
		}),
	projectTechLead: Yup.string().matches(/^([^,]{6},)*[^,]{6}$/, {
		// Matches Departmental UserIDs separated by comma e.g. ABC123, DEF456
		message: 'Incorrect format. Example ABC123 or ABC123,DEF456',
		excludeEmptyString: true
	}),
	wbsCode: Yup.string().required('A WBS Code is required.'),
	language: Yup.string().when('projectType', {
		is: 'software',
		then: Yup.string().required('Language / Framework is required.')
	})
});
