import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import DialogData from './dialog-data';
import _ from 'lodash';
import { updateUser } from '../helpers/api-calls.js';

class SelectedUserPopup extends React.Component {

    constructor(props) {
        super(props);

        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
        this.cloneUserIfExists = this.cloneUserIfExists.bind(this);
        this.updatedUser = this.cloneUserIfExists(this.props.user);
        this.changeDialogState = this.changeDialogState.bind(this);
        this.changeRole = this.changeRole.bind(this);
        this.changeTeam = this.changeTeam.bind(this);
        this.changeIsAdmin = this.changeIsAdmin.bind(this);
        this.isUserUpdated = this.isUserUpdated.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

        this.state = {
            open: this.props.user ? true : false
        }
    }

    cloneUserIfExists(user) {
        return (user) ? _.cloneDeep(user) : {};
    }

    submit() {
        if (this.isUserUpdated()) {
            updateUser(this.props.baseUrl, this.updatedUser)
                .then(response => {
                    this.changeDialogState(false);
                    this.props.onSubmit(this.updatedUser, response.data)
                })
                .catch(err => {
                    this.cancel();
                    this.props.onFailure(err);
                });
        } else {
            this.cancel();
        }
    }

    cancel() {
        this.changeDialogState(false);
        this.props.onCancel();
    }

    changeDialogState(isOpen) {
        this.setState({
            open: isOpen
        });
    }

    deleteUser() {
        this.updatedUser.isDeleted = !this.props.user.isDeleted;
        this.updatedUser.isAdmin = false;
        this.submit();
    }

    isUserUpdated() {
        if (this.updatedUser.role.roleRef !== this.props.user.role.roleRef ||
            this.updatedUser.team.teamRef !== this.props.user.team.teamRef ||
            this.updatedUser.isAdmin !== this.props.user.isAdmin ||
            this.updatedUser.isDeleted !== this.props.user.isDeleted) {
            return true;
        }
        return false;
    }

    changeRole(roleRef) {
        this.updatedUser.role.roleRef = roleRef;
        this.updatedUser.role.roleName = this.props.roles[roleRef].roleName;
    }

    changeTeam(teamRef) {
        this.updatedUser.team.teamRef = teamRef;
        this.updatedUser.team.teamName = this.props.teams[teamRef].teamName;
    }

    changeIsAdmin(isAdmin) {
        this.updatedUser.isAdmin = isAdmin;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user && (!this.props.user || nextProps.user.id !== this.props.user.id)) {
            this.changeDialogState(true);
            this.updatedUser = this.cloneUserIfExists(nextProps.user);
        }
    }

    render() {
        let title, label = "dummy";
        if (this.props.user) {
            title = `Modify the data of this user: ${this.props.user.userName}`;
            label = this.props.user.isDeleted ? "Activate User" : "Delete User";
        }

        const actions = [
            <FlatButton
                label={label}
                secondary={true}
                keyboardFocused={false}
                onTouchTap={this.deleteUser}
            />,
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.cancel}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.submit}
            />
        ];

        return (
            <Dialog
                title={title}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.cancel}
            >
            {(this.state.open && <DialogData
                user={this.props.user}
                teams={this.props.teams}
                roles={this.props.roles}
                changeTeam={this.changeTeam}
                changeRole={this.changeRole}
                changeIsAdmin={this.changeIsAdmin}
            />)}
            </Dialog>
        )
    }
}

SelectedUserPopup.propTypes = {
    baseUrl: React.PropTypes.string.isRequired,
    user: React.PropTypes.object,
    onSubmit: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    teams: React.PropTypes.object.isRequired,
    roles: React.PropTypes.object.isRequired
};
export default SelectedUserPopup;