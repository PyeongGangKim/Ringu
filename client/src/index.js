import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie11';

import * as serviceWorker from './serviceWorker';

import Root from './client/Root';

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();
