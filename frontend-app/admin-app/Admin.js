import React from 'react';
import App from '../common/App.js';
import UserList from './user-list.js';
import Snackbar from 'material-ui/lib/snackbar';
import { getUsers } from '../helpers/api-calls.js';

class Admin extends React.Component {

    constructor(props) {
        super(props);

        this.setAlert = this.setAlert.bind(this);
        this.refreshData = this.refreshData.bind(this);

        this.state = {
            users: this.props.users,
            deletedUsers: this.props.deletedUsers,
            alert: {
                message: "",
                open: false
            }
        };
    }

    setAlert(message) {
        var alert = {
            message: message,
            open: true
        };
        this.setState({
            alert: alert
        });
    }

    refreshData() {
        getUsers(this.props.baseUrl)
            .then(response => this.setState({
                    users: response.data.users,
                    deletedUsers: response.data.deletedUsers
                }
            ));
    }

    handleRequestSnackBarClose() {
        var alert = {
            message: "",
            open: false
        };
        this.setState({
            alert: alert
        });
    }

    render() {
        return (
            <App>
                <div>
                    <div className="row">
                        <h5 className="header"> Active users </h5>
                        <UserList
                            baseUrl={this.props.baseUrl}
                            users={this.state.users}
                            teams={this.props.teams}
                            roles={this.props.roles}
                            onFailure={this.setAlert}
                            onSuccess={this.setAlert}
                            onUpdate={this.refreshData}
                        />
                    </div>
                    <div className="row">
                        <h5 className="header"> Deleted users </h5>
                        <UserList
                            baseUrl={this.props.baseUrl}
                            users={this.state.deletedUsers}
                            teams={this.props.teams}
                            roles={this.props.roles}
                            onFailure={this.setAlert}
                            onSuccess={this.setAlert}
                            onUpdate={this.refreshData}
                        />
                    </div>
                    <Snackbar
                        open={this.state.alert.open}
                        message={this.state.alert.message}
                        autoHideDuration={4000}
                        onRequestClose={this.handleRequestSnackBarClose.bind(this)}
                    />
                </div>
            </App>
        )
    }
}

Admin.propTypes = {
    baseUrl: React.PropTypes.string.isRequired,
    users: React.PropTypes.array.isRequired,
    deletedUsers: React.PropTypes.array.isRequired,
    teams: React.PropTypes.object.isRequired,
    roles: React.PropTypes.object.isRequired
};

export default Admin;