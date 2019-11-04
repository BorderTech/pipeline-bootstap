## Description

Backend REST API for Pipeline Bootstrap built using the [Nest](https://github.com/nestjs/nest) framework with TypeScript.

Swagger documentation available at /api

## Pre-requisites

You will need:

-   NodeJS (minimum version 8.11.3, version 10 is recommended)
-   NPM (usually it's installed with NodeJS, version 6.4.1 is recommended)

## Installation

```bash
$ npm install
```

## Running the app

A .env.example file has been included with all required environment variables. This file as it is used to execute unit tests within the application.

The env.example should be used as the base for each of the separate environment .env files. E.g. running the application is development mode relies on the .env file development.env

The .env file should be kept out of version control as can contain sensitive API keys and passwords.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Troubleshoot setup

-   Delete the folder `node_modules`.
-   Delete the file `package-lock.json`.
-   Set your proxies.
-   Edit the project's `.npmrc`.
-   Do `npm install`.
