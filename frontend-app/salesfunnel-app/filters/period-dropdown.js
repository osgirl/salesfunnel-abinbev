import React from 'react';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

class PeriodDropDown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.periodData.periodRef
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, index, value) {
        this.setState({value});
        this.props.callback(value);
    }

    createMenuItems(periodData) {
        return periodData.periods.map((period, index) => {
            return <MenuItem value={period._id} primaryText={period.name} key={index}/>
        });
    }

    render() {
        var menuItems = this.createMenuItems(this.props.periodData);
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

export default PeriodDropDown;