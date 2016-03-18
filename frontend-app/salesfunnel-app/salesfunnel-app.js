import React from 'react';
import { render } from 'react-dom';
import Salesfunnel from './Salesfunnel.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render(
    React.createFactory(Salesfunnel)(window.salesfunnelProps),
    document.getElementById('salesfunnel-app')
);