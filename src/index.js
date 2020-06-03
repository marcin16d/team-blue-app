import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import App from './App';
import { makeServer } from "./server"

makeServer({ environment: 'development' })

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);