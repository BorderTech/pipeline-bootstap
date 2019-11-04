# Pipeline Bootstrap React SPA

This project was bootstrapped with [Create-React-App](https://github.com/facebookincubator/create-react-app).

## Pre-requisites

You will need:

-   NodeJS (minimum version 8.11.3, version 10 is recommended)
-   NPM (usually it's installed with NodeJS, version 6.4.1 is recommended)

## Getting started

To get the frontend running locally:

-   Clone this repo
-   npm install to install all required dependencies
-   npm start to start the local server (this project uses create-react-app)

Local web server will use port the standard React port 3000. Ensure that this port does not conflict with backends (e.g. Rails or Node).

## Making requests to the backend API

You can view the README [here](https://github.com) for the API server which contains all routes & responses for the server (via Swagger). The backend API runs on port 5000 to avoid conflicts with this React frontend.

## Functionality overview

This application is a pipeline automation tool called "Pipeline Bootstrap". It uses a custom API for all requests. Supports the automated creation of the following pipeline components:

-   Jira projects (Server edition only)
-   Confluences spaces (Server edition only)
-   Bitbucket repositories (Server edition only)
-   Jenkins jobs

General functionality:

-   CR\*\* pipeline requests
-   GET and display paginated list of pipeline requests
-   CR\*D pipelines

The general page breakdown looks like:

-   Home Page (URL: '/')
    -   User instructions / information
-   Pipeline Requests (URL: '/pipeline-requests')
    -   Paginated/filterable table of pipeline requests
-   Create Pipeline Request (URL: '/pipeline-requests/create')
-   Pipeline Request Page (URL: '/pipeline-requests/pipeline-request-id-here')
    -   View pipeline request details
    -   Approve pipeline button (triggers pipeline creation via API)
-   Help Page (URL: '/help')
    -   FAQ/instructions for application usage

### Troubleshoot setup

-   Delete the folder `node_modules`.
-   Delete the file `package-lock.json`.
-   Set your proxies.
-   Edit the project's `.npmrc`.
-   Do `npm install`.

## Folder Structure

For the project to build, **these files must exist with exact file names**:

-   `public/index.html` is the page template;
-   `src/index.js` is the JavaScript entry point.

You can delete or rename the other files.

You may create subdirectories inside `src`. For faster rebuilds, only files inside `src` are processed by Webpack.
You need to **put any JS and CSS files inside `src`**, otherwise Webpack won’t see them.

Only files inside `public` can be used from `public/index.html`.

## Available Scripts

In the project directory, you can run:

### `npm run-script sass`

Converts Sass `*.scss` files to `*.css` files before you run the app the first time.

### `npm run-script sass-dev`

Converts Sass `*.scss` files to `*.css` files and continuously watch for changes and run the output to the `src\styles` folder so during development you can see the changes in the styling of your components.

### `npm start`

Runs the application in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

See the section about [running tests](#running-tests) for more information.

### `npm run-script lighthouse`

Runs an audit on the application for performance, accessibility, progressive app and best practices.

See the section about [running tests](#running-tests) for more information.

### `npm run-script sass-build`

Updates the `*.css` files to reflect the changes made in the Sass code.

### `npm run-script build`

Transpiles the stylesheets automatically before the build process happens and builds the application for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
The application is ready to be deployed.

If you want to see the application served and other people can access it, see the section about [deployment for Create-react-app](#https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Styles - Using a CSS Preprocessor

This project is configured to use [Sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html). It still allows you to create a component with its own styles aligning with Create-react-app's recommendation that you don't reuse the same CSS classes across different components.

We use Sass to convert to CSS so we can still reference the \*.css in the project without ejecting or installing more npm packages minimising dependencies.

**Notes**

1. You have to have 2 processes running in terminal while developing. You'll need the dev server along with the `sass --watch`process. If you don't want to have 2 processes running, you can simply delete all \*css files and `npm run-script sass` and refresh the dev server to see the style changes.
2. You may forget to transpile changes/updates to the stylesheets before the build process. To get around this the Sass conversion script, `sass --update` process is added to the `package.json` as part of the `scripts' for the build process.

The Sass conversion script in the `package.json` as part of the `scripts` for the React start and build process:

```diff
   "scripts": {
+   "sass": "node ./node_modules/sass/sass src/styles:src/styles/css",
+   "sass-dev": "node ./node_modules/sass/sass --watch src/styles:src/styles/css",
    "start": "react-scripts start",
+   "sass-build": "node ./node_modules/sass/sass --update src/styles:src/styles/css",
+   "build": "npm run sass-build && react-scripts build",
```

All generated CSS files and a temporary folder `.sass-cache` used during the conversion process are removed from the source control.

## Running Tests

This project uses [Jest](https://facebook.github.io/jest/) as its test runner. For more information on writing tests and making assertions refer to [Jest documentation](https://jestjs.io/docs/en/getting-started).

Jest looks for test files (files with suffix `*.test.js`) in the `src\test` folder.

You can run individual test by specifying a test file - `npm test <filename.test.js>`.

### Unit Tests

In addition to Jest, Enzyme is used to assert and manipulate your rendered components. You can read the [Enzyme documentation](http://airbnb.io/enzyme/) for more information.

The project is configured to make React, Jest and Enzyme work together including stubbing out resources, like images or styles with a single module.

Unlike the simple smoke test using `ReactDOM.render()` (App.test.js), this test only renders `<App>` and doesn’t go deeper. For example, even if `<App>` itself renders a `<Button>` that throws, this test will pass. Shallow rendering is great for isolated unit tests, but you may still want to create some full rendering tests to ensure the components integrate correctly. Enzyme supports [full rendering with `mount()`](http://airbnb.io/enzyme/docs/api/mount.html), and you can also use it for testing state changes and component lifecycle.
