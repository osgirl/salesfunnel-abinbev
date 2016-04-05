import React from 'react';
import App from '../common/App.js';
import UserList from './user-list.js';

class Admin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <App>
                <UserList users={this.props.users} />
            </App>
        )
    }
}

Admin.propTypes = {
    baseUrl: React.PropTypes.string.isRequired,
    users: React.PropTypes.array.isRequired
};

export default Admin;