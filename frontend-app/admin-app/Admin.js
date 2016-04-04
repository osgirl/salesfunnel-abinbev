import React from 'react';
import App from '../common/App.js';

class Admin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <App>
                <div>
                    Dit is de admin app!
                </div>
            </App>
        )
    }
}

Admin.propTypes = {
    baseUrl: React.PropTypes.string.isRequired
};

export default Admin;