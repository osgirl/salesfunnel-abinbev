import React from 'react';
import App from '../common/App.js';
import UserList from './user-list.js';
import Snackbar from 'material-ui/lib/snackbar';

class Admin extends React.Component {

    constructor(props) {
        super(props);

        this.setAlert = this.setAlert.bind(this);

        this.state = {
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
                    <UserList
                        baseUrl={this.props.baseUrl}
                        users={this.props.users}
                        teams={this.props.teams}
                        roles={this.props.roles}
                        onFailure={this.setAlert}
                        onSuccess={this.setAlert}
                    />
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
    teams: React.PropTypes.object.isRequired,
    roles: React.PropTypes.object.isRequired
};

export default Admin;