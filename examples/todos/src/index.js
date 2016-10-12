import React from 'react';
import ReactDOM from 'react-dom';

import Provider from '../../../lib/components/Provider'
import Store from '../../../lib/store'

import App from './App';
import './index.css';

import actions from './actions'

let store = new Store(actions)


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
