import React from 'react';
import { render } from 'react-dom';
import Salesfunnel from './Salesfunnel.js';

render(
    React.createFactory(Salesfunnel)(window.salesfunnelProps),
    document.getElementById('salesfunnel-app')
);