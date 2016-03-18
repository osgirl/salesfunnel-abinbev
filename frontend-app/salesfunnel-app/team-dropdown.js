import React from 'react';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { getTeams } from '../helpers/api-calls.js';

class TeamDropDown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.teamData.teamRef
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, index, value) {
        this.setState({value});
        this.props.callback(value);
    }

    createMenuItems(teamData) {
        return teamData.teams.map((team, index) => {
            return <MenuItem value={team._id} primaryText={team.teamName} key={index}/>
        });

    }

    render() {
        var menuItems = this.createMenuItems(this.props.teamData);
        return (
            <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                {menuItems}
            </DropDownMenu>
        )
    }

}

export default TeamDropDown;