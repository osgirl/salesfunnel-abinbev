import React, { Component, PropTypes } from 'react';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import { muiTheme } from './mui-theme.js';

class App extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
        { this.props.children }
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    children: PropTypes.node.isRequired
};

export default App;