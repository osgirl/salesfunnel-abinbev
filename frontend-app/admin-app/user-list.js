import React from 'react';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

class UserList extends React.Component {

    _createUserItems(users) {
        return users.map((user, index) => {
            return (
                <TableRow key={index}>
                    <TableRowColumn>{user.userName}</TableRowColumn>
                    <TableRowColumn>{user.email}</TableRowColumn>
                    <TableRowColumn>{user.role.roleName}</TableRowColumn>
                    <TableRowColumn>{user.team.teamName}</TableRowColumn>
                    <TableRowColumn>{(user.isAdmin) ? "Yes" : "No"}</TableRowColumn>
                </TableRow>
            )
        });

    }

    render() {
        var userItems = this._createUserItems(this.props.users);
        return (
            <Table selectable={false}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn>Username</TableHeaderColumn>
                        <TableHeaderColumn>Email</TableHeaderColumn>
                        <TableHeaderColumn>Role</TableHeaderColumn>
                        <TableHeaderColumn>Team</TableHeaderColumn>
                        <TableHeaderColumn>Admin</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>{userItems}</TableBody>
            </Table>
        )
    }
}

UserList.propTypes = {
    users: React.PropTypes.array.isRequired
};
export default UserList;