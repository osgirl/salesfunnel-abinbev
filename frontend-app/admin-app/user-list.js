import React from 'react';
import UsersTableWrapper from './users-table-wrapper.js';
import SelectedUserPopup from './selected-user-popup.js';
import { getUsers } from '../helpers/api-calls.js';
import _ from 'lodash';

class UserList extends React.Component {

    constructor(props) {
        super(props);

        this.updateData = this.updateData.bind(this);
        this.deselectUser = this.deselectUser.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.locallyUpdateUser = this.locallyUpdateUser.bind(this);
        this.alertError = this.alertError.bind(this);

        this.state = {
            users: this.props.users,
            selectedUser: undefined
        };
    }

    selectUser(user) {
        this.setState({
            selectedUser: user
        });
    }

    deselectUser() {
        this.setState({
            selectedUser: undefined
        });
    }

    alertError(errorMessage) {
        this.props.onFailure(errorMessage)
    }

    locallyUpdateUser(updatedUser) {
        for (let user of this.state.users) {
            if (user.id === updatedUser.id) {
                _.merge(user, updatedUser);
            }
        }
        
    }

    updateData(updatedUser, message) {
        this.props.onSuccess(message);
        this.deselectUser();
        this.locallyUpdateUser(updatedUser);
        getUsers(this.props.baseUrl)
            .then(response => this.setState({users: response.data}));
    }

    render() {
        return (
            <div className="card">
                <UsersTableWrapper
                    users={this.state.users}
                    onUserSelect={this.selectUser}
                />
                <SelectedUserPopup
                    baseUrl={this.props.baseUrl}
                    user={this.state.selectedUser}
                    onSubmit={this.updateData}
                    onFailure={this.alertError}
                    onCancel={this.deselectUser}
                    teams={this.props.teams}
                    roles={this.props.roles}
                />
            </div>
        )
    }
}

UserList.propTypes = {
    onSuccess: React.PropTypes.func.isRequired,
    onFailure: React.PropTypes.func.isRequired,
    baseUrl: React.PropTypes.string.isRequired,
    users: React.PropTypes.array.isRequired,
    teams: React.PropTypes.object.isRequired,
    roles: React.PropTypes.object.isRequired
};
export default UserList;