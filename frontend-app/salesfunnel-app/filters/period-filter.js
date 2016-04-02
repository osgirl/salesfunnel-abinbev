import React from 'react';
import PeriodDropDown from './period-dropdown.js';

class PeriodFilter extends React.Component {

    render() {
        return (
            <div className = "row">
                <div className = "col s12 m4">
                    <p> Date range: </p>
                </div>
                <div className = "col s12 m8">
                    <PeriodDropDown
                        callback={this.props.callback}
                        periodData={this.props.periodData}
                    />
                </div>
            </div>
        )
    }
}

PeriodFilter.propTypes = {
    periodData: React.PropTypes.object.isRequired,
    callback: React.PropTypes.func.isRequired
};
export default PeriodFilter;