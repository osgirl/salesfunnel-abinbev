import React from 'react';
import TeamDropDown from './team-dropdown.js';

class TeamFilter extends React.Component {

    render() {
        return (
            <div className = "row">
                <div className = "col s12 m4">
                    <p> Team: </p>
                </div>
                <div className = "col s12 m8">
                    <TeamDropDown
                        callback={this.props.callback}
                        teamData={this.props.teamData}
                    />
                </div>
            </div>
        )
    }
}

TeamFilter.propTypes = {
    teamData: React.PropTypes.object.isRequired,
    callback: React.PropTypes.func.isRequired
};
export default TeamFilter;