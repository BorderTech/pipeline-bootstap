import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/css/home-affairs-theme.css';
import './styles/css/app.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

if (process.env.NODE_ENV !== 'production') {
	var axe = require('react-axe');
	axe(React, ReactDOM, 1000);
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
