# pipeline-bootstap

Graduate team project to create an app to automate set up of SDLC automation pipeline artefacts.

## Status

[![Build Status](https://travis-ci.com/BorderTech/pipeline-bootstap.svg?branch=master)](https://travis-ci.com/BorderTech/pipeline-bootstap)

## Purpose

Pipeline Bootstrap is a new way for software and business projects to create a set of artefacts in the Department’s CI/CD pipeline using existing service APIs. The aim is to simplify the setup and configuration of a pipeline accross across multiple systems.

It uses a custom API for all requests. Supports the automated creation of the following pipeline components:

-   Jira projects (Server edition only)
-   Confluences spaces (Server edition only)
-   Bitbucket repositories (Server edition only)
-   Jenkins jobs

Pipeline Bootstrap is the first step to an entirely self-service portal to allow to creation of pipelines without administrator intervention.

## Contributing

Contributions welcome: See the CONTRIBUTING and CODE_OF_CONDUCT files in this project.

## Building, Running & Testing

There are two components to the Pipeline Bootstrap application. See the respective `frontend` and `backend` README files for instructions on how to build, run and test the application.
