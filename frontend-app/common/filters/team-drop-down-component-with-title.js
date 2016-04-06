import React from 'react';
import TeamDropDownComponent from './team-dropdown-component.js';

class TeamDropDownComponentWithTitle extends React.Component {

    constructor(props) {
        super(props);
        this.getDropDownComponent = this.getDropDownComponent.bind(this);
    }

    getDropDownComponent() {
        return (
            <TeamDropDownComponent
                teamsMappedById={this.props.teamsMappedById}
                selectedRef={this.props.selectedRef}
                onSelect={this.props.onSelect}
            />
        )
    }

    render() {
        return (
            <div className = "row">
                <div className = "col s12 m4">
                    <p> {this.props.dropDownTitle}: </p>
                </div>
                <div className = "col s12 m8">
                {this.getDropDownComponent()}
                </div>
            </div>
        )
    }
}

TeamDropDownComponentWithTitle.propTypes = {
    dropDownTitle: React.PropTypes.string.isRequired,
    teamsMappedById: React.PropTypes.object.isRequired,
    selectedRef: React.PropTypes.string,
    onSelect: React.PropTypes.func.isRequired
};
export default TeamDropDownComponentWithTitle;