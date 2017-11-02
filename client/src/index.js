import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "mobx-react";
import './index.css';
import App from './App';
import stores from './stores/index'
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
    <Provider {...stores}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
