import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "mobx-react";
import './index.css';
import App from './App';
import * as stores from './stores/index'
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<Provider store={{User: stores.User, BlogPost: stores.BlogPost}}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
