import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from '../../../lib/simple-react-redux'
import createStore, {logMiddleware, asyncActionMiddleware} from '../../../lib/simple-redux'

import App from './App';
import './index.css';

import actions from './actions'

let store = createStore(actions, logMiddleware, asyncActionMiddleware)


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
