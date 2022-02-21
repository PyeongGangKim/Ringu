import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie11';
//import 'bootstrap/dist/css/bootstrap.min.css';
import iamport from './config/iamport';

import * as serviceWorker from './serviceWorker';

import Root from './client/Root';

var KAKAO = require('./config/kakao_auth')[process.env.REACT_APP_ENV];

const {Kakao, IMP} = window;

IMP.init(iamport.IMP_CODE)
Kakao.init(KAKAO.JAVASCRIPT_KEY)

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();
