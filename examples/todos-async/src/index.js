import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from '../../../lib/simple-react-redux'
import createStore, {middlewareLog, middlewareAsyncAction, middlewareFetch} from '../../../lib/simple-redux'

import App from './App';
import './index.css';

import actions from './actions'

let store = createStore(actions, middlewareLog, middlewareAsyncAction, middlewareFetch)


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
