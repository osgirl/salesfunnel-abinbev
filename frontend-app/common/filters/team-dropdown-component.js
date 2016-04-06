import React from 'react';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

class TeamDropDownComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.selectedRef
        };
        this.handleChange = this.handleChange.bind(this);
        this.createMenuItems = this.createMenuItems.bind(this);
    }

    handleChange(event, index, value) {
        this.setState({value});
        this.props.onSelect(value);
    }

    createMenuItems() {
        return Object.keys(this.props.teamsMappedById).map((teamId) => {
            return <MenuItem value={teamId} primaryText={this.props.teamsMappedById[teamId].teamName} key={teamId}/>
        });

    }

    render() {
        var menuItems = this.createMenuItems();
        return (
            <DropDownMenu
                value={this.state.value}
                onChange={this.handleChange}
            >

                {menuItems}
            </DropDownMenu>
        )
    }

}

TeamDropDownComponent.propTypes = {
    teamsMappedById: React.PropTypes.object.isRequired,
    selectedRef: React.PropTypes.string,
    onSelect: React.PropTypes.func.isRequired
};

export default TeamDropDownComponent;