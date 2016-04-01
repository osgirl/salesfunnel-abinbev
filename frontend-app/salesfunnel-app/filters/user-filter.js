import React from 'react';
import UsersAutoCompleteDropDown from './users-autocomplete-dropdown.js';

class UserFilter extends React.Component {

    render() {
        return (
            <div className = "row hide-on-small-only">
                <div className = "col s12 m4">
                    <p> Search for a specific user: </p>
                </div>
                <div className = "col s12 m8">
                    <UsersAutoCompleteDropDown
                        callback={this.props.callback}
                        users={this.props.filteredUsers}
                        selectedUser={this.props.selectedUser}
                    >
                    </UsersAutoCompleteDropDown>
                </div>
            </div>
        )
    }
}

UserFilter.propTypes = {
    selectedUser: React.PropTypes.string,
    filteredUsers: React.PropTypes.array.isRequired,
    callback: React.PropTypes.func.isRequired
};

export default UserFilter;