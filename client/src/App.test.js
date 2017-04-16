import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { LocalStorageMock } from '../__mocks__/localStorage'

global.localStorage = LocalStorageMock()

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
