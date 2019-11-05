import React from 'react';
import { shallow, mount } from 'enzyme';
import ProjectHeader from '../components/layout/ProjectHeader';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('ProjectHeader', () => {
	const projectName = 'Test Project Name';
	const mockApprovePipelineRequest = jest.fn();
	const url = 'www.example.com';
	const wrapper = mount(
		<Router>
			<ProjectHeader
				projectName={projectName}
				url={url}
				status='To Do'
				approvePipelineRequest={mockApprovePipelineRequest}
				creatingPipeline={false}
			/>
		</Router>
	);

	expect.extend(toHaveNoViolations);

	it('should not have basic accessibility issues', async () => {
		const html = ReactDOMServer.renderToString(
			<Router>
				<ProjectHeader
					projectName={projectName}
					url={url}
					status='To Do'
					approvePipelineRequest={mockApprovePipelineRequest}
					creatingPipeline={false}
				/>
			</Router>
		);
		const results = await axe(html);
		expect(results).toHaveNoViolations();
	});

	it('should render h2 header element', () => {
		expect(wrapper.find('h2').length).toBe(1);
	});

	it('should render an a element with link url', () => {
		expect(wrapper.find(`a[href="www.example.com"]`).length).toBe(1);
	});
	it('should render a button to trigger the approval of Pipeline', () => {
		wrapper.setProps({ status: 'To Do' });
		expect(wrapper.find(`button#approveRequest`).length).toBe(1);
	});
	it('should call onClick function after clicking button', () => {
		wrapper.setProps({ status: 'To Do' });
		wrapper.find(`button#approveRequest`).simulate('click');
		expect(mockApprovePipelineRequest.mock.calls.length).toEqual(1);
	});

	it('should display "Creating Pipeline... when creatingPipeline set to true', () => {
		let wrapper = mount(
			<Router>
				<ProjectHeader
					projectName={projectName}
					url={url}
					status='To Do'
					approvePipelineRequest={mockApprovePipelineRequest}
					creatingPipeline={false}
				/>
			</Router>
		);
		expect(wrapper.find(`button#approveRequest`).text()).toEqual(
			'Approve Request'
		);
		wrapper.unmount();

		wrapper = mount(
			<Router>
				<ProjectHeader
					projectName={projectName}
					url={url}
					status='To Do'
					approvePipelineRequest={mockApprovePipelineRequest}
					creatingPipeline={true}
				/>
			</Router>
		);
		expect(wrapper.find(`button#approveRequest`).text()).toEqual(
			'Creating Pipeline...'
		);
	});
});
