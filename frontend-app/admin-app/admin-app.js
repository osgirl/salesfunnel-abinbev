import React from 'react';
import { render } from 'react-dom';
import Admin from './Admin.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render(
    React.createFactory(Admin)(window.adminProps),
    document.getElementById('admin-app')
);