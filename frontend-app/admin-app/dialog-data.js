import React from 'react';
import Toggle from 'material-ui/lib/toggle';
import TeamDropDownComponentWithTitle from '../common/filters/team-drop-down-component-with-title.js';
import RoleDropDownComponentWithTitle from '../common/filters/role-drop-down-component-with-title.js';

class DialogData extends React.Component {

    constructor(props) {
        super(props);

        this.user = this.props.user;

        this.changeTeam = this.changeTeam.bind(this);
        this.changeRole = this.changeRole.bind(this);
    }

    changeTeam(teamRef) {
        this.props.changeTeam(teamRef);
    }
    changeRole(roleRef) {
        this.props.changeRole(roleRef);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <TeamDropDownComponentWithTitle
                        dropDownTitle="Team"
                        teamsMappedById={this.props.teams}
                        selectedRef={this.user.team.teamRef}
                        onSelect={this.changeTeam}
                    />
                    <RoleDropDownComponentWithTitle
                        dropDownTitle="Role"
                        rolesMappedById={this.props.roles}
                        selectedRef={this.user.role.roleRef}
                        onSelect={this.changeRole}
                    />
                </div>

            </div>
        )
    }
}

DialogData.propTypes = {
    user: React.PropTypes.object.isRequired,
    teams: React.PropTypes.object.isRequired,
    roles: React.PropTypes.object.isRequired,
    changeTeam: React.PropTypes.func.isRequired,
    changeRole: React.PropTypes.func.isRequired
};
export default DialogData;