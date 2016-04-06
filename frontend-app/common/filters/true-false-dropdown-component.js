import React from 'react';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TeamDropDownComponent from './team-dropdown-component.js';

class TrueFalseDropDownComponent extends TeamDropDownComponent {

    createMenuItems() {
        return [
            <MenuItem value={true} primaryText={"Yes"} key={"Yes"}/>,
            <MenuItem value={false} primaryText={"No"} key={"No"}/>
        ]
    }

}

TrueFalseDropDownComponent.propTypes = {
    selectedRef: React.PropTypes.bool,
    onSelect: React.PropTypes.func.isRequired
};

export default TrueFalseDropDownComponent;