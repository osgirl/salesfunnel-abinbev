import React from 'react';
import RoleDropDownComponent from './role-dropdown-component.js';
import TeamDropDownComponentWithTitle from './team-drop-down-component-with-title.js';

class RoleDropDownComponentWithTitle extends TeamDropDownComponentWithTitle {

    getDropDownComponent() {
        return (
            <RoleDropDownComponent
                rolesMappedById={this.props.rolesMappedById}
                selectedRef={this.props.selectedRef}
                onSelect={this.props.onSelect}
            />
        )
    }

}

RoleDropDownComponentWithTitle.propTypes = {
    dropDownTitle: React.PropTypes.string.isRequired,
    rolesMappedById: React.PropTypes.object.isRequired,
    selectedRef: React.PropTypes.string,
    onSelect: React.PropTypes.func.isRequired
};
export default RoleDropDownComponentWithTitle;