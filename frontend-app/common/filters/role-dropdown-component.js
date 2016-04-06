import React from 'react';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TeamDropDownComponent from './team-dropdown-component.js';

class RoleDropDownComponent extends TeamDropDownComponent {

    createMenuItems() {
        return Object.keys(this.props.rolesMappedById).map((roleId) => {
            return <MenuItem value={roleId} primaryText={this.props.rolesMappedById[roleId].roleName} key={roleId}/>
        });

    }

}

RoleDropDownComponent.propTypes = {
    rolesMappedById: React.PropTypes.object.isRequired,
    selectedRef: React.PropTypes.string,
    onSelect: React.PropTypes.func.isRequired
};

export default RoleDropDownComponent;