import React from 'react';
import TrueFalseDropDownComponent from './true-false-dropdown-component.js';
import TeamDropDownComponentWithTitle from './team-drop-down-component-with-title.js';

class TrueFalseDropDownComponentWithTitle extends TeamDropDownComponentWithTitle {

    getDropDownComponent() {
        return (
            <TrueFalseDropDownComponent
                selectedRef={this.props.selectedRef}
                onSelect={this.props.onSelect}
            />
        )
    }

}

TrueFalseDropDownComponentWithTitle.propTypes = {
    dropDownTitle: React.PropTypes.string.isRequired,
    selectedRef: React.PropTypes.bool,
    onSelect: React.PropTypes.func.isRequired
};
export default TrueFalseDropDownComponentWithTitle;