import React from 'react';
import { render } from 'react-dom';
import Registration from './Registration.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render(
    React.createFactory(Registration)(window.registrationProps),
    document.getElementById('registration-app')
);