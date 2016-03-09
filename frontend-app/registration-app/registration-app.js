import React from 'react';
import { render } from 'react-dom';
import Registration from './Registration.js';

render(
    React.createFactory(Registration)(window.registrationProps),
    document.getElementById('registration-app')
);