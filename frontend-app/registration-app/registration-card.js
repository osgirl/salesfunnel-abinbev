import React from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import RaisedButton from 'material-ui/lib/raised-button';
import { RegistrationNumberField } from './Registration-number-field.js';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

class RegistrationCard extends React.Component {

    constructor(props) {
        super(props);

        this.isValid = true;

        this.state = {
            controlledDate: new Date(),
            deals: {
                errorText: undefined,
                value: undefined
            },
            visits: {
                errorText: undefined,
                value: undefined
            },
            proposals: {
                errorText: undefined,
                value: undefined
            },
            negos: {
                errorText: undefined,
                value: undefined
            }
        };
    }

    _handleDateChange(event, date) {
        this.setState({
            controlledDate: date
        });
    }

    ensureAllFormFieldsAreValid() {
        this.isValid = true;
        this.ensureRequiredFieldIsFilledIn(this.state.visits);
        this.ensureRequiredFieldIsFilledIn(this.state.negos);
        this.ensureRequiredFieldIsFilledIn(this.state.proposals);
        this.ensureRequiredFieldIsFilledIn(this.state.deals);

        this.setState({
            visits: this.state.visits,
            negos: this.state.negos,
            proposals: this.state.proposals,
            deals: this.state.deals
        })
    }

    ensureRequiredFieldIsFilledIn(field) {
        if (!field.value) {
            field.errorText = "This field is required";
            this.isValid = false;
        } else {
            field.errorText = undefined;
        }
        return field;
    }

    submitSales() {
        this.ensureAllFormFieldsAreValid();
        if (this.isValid) {
            this.props.onSubmitSales({
                date: this.state.controlledDate,
                visits: this.state.visits.value,
                negos: this.state.negos.value,
                proposals: this.state.proposals.value,
                deals: this.state.deals.value
            });
        }
    }

    visitsTextChanged(value) {
        this.state.visits.value = value;
        this.ensureRequiredFieldIsFilledIn(this.state.visits);

        this.setState({
            visits: this.state.visits
        })
    }

    negosTextChanged(value) {
        this.state.negos.value = value;
        this.ensureRequiredFieldIsFilledIn(this.state.negos);

        this.setState({
            negos: this.state.negos
        })
    }

    proposalsTextChanged(value) {
        this.state.proposals.value = value;
        this.ensureRequiredFieldIsFilledIn(this.state.proposals);

        this.setState({
            proposals: this.state.proposals
        })
    }

    dealsTextChanged(value) {
        this.state.deals.value = value;
        this.ensureRequiredFieldIsFilledIn(this.state.deals);

        this.setState({
            deals: this.state.deals
        })
    }

    render() {
        return (
            <div className="card grey lighten-5">
                <div className="container">
                    <div className="row">
                        <div className="col s12">
                            <h5 className="header">Register the sales of the day
                            </h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col m6 hide-on-small-only">
                            <p>Pick a date:</p>
                        </div>
                        <div className="col s12 m6">
                            <DatePicker
                                hintText="Portrait Dialog"
                                value={this.state.controlledDate}
                                onChange={this._handleDateChange.bind(this)}
                                maxDate={new Date()}/>
                        </div>
                    </div>
                    <RegistrationNumberField
                        id="visits"
                        hintText="Visits"
                        floatingLabelText="Total visits of the day"
                        errorText={this.state.visits.errorText}
                        value={this.state.visits.value}
                        textChanged={this.visitsTextChanged.bind(this)}
                    />
                    <RegistrationNumberField
                        id="negos"
                        hintText="Prospects"
                        floatingLabelText="Total prospects of the day"
                        errorText={this.state.negos.errorText}
                        value={this.state.negos.value}
                        textChanged={this.negosTextChanged.bind(this)}
                    />
                    <RegistrationNumberField
                        id="proposals"
                        hintText="Proposals"
                        floatingLabelText="Total proposals of the day"
                        errorText={this.state.proposals.errorText}
                        value={this.state.proposals.value}
                        textChanged={this.proposalsTextChanged.bind(this)}
                    />
                    <RegistrationNumberField
                        id="deals"
                        hintText="Deals"
                        floatingLabelText="Total confirmed deals of the day"
                        errorText={this.state.deals.errorText}
                        value={this.state.deals.value}
                        textChanged={this.dealsTextChanged.bind(this)}
                    />
                    <div className = "row col s12">
                        <RaisedButton
                            label="Submit your sales"
                            secondary={false}
                            primary={true}
                            style={{margin: 12}}
                            onMouseUp={this.submitSales.bind(this)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

RegistrationCard.propTypes = {
    onSubmitSales: React.PropTypes.func
};

export default RegistrationCard;