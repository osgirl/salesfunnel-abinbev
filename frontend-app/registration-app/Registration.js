import React from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import RaisedButton from 'material-ui/lib/raised-button';
import { RegistrationNumberField } from './Registration-number-field.js';
import TextField from 'material-ui/lib/text-field';
import Snackbar from 'material-ui/lib/snackbar';
import { saveRegistrationData } from '../helpers/api-calls.js';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import App from '../common/App.js';

class Registration extends React.Component {

    constructor(props) {
        super(props);

        this.isValid = true;

        this.state = {
            alert: {
                message: "",
                open: false
            },
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
        this.ensureHigherThan(this.state.negos, this.state.visits, "Visits should be higher than nego's");
        this.ensureHigherThan(this.state.proposals, this.state.negos, "Nego's should be higher than Proposals");
        this.ensureHigherThan(this.state.deals, this.state.proposals, "Proposals should be higher than Nego's");

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

    ensureHigherThan(lowerField, higherField, errorText) {
        if (lowerField.value && higherField.value) {
            if (Number(lowerField.value) > Number(higherField.value)) {
                lowerField.errorText = errorText;
                this.isValid = false;
            } else {
                lowerField.errorText = undefined;
            }
        }
    }

    submitSales() {
        this.ensureAllFormFieldsAreValid();
        if (this.isValid) {
            var registrationForm = {
                date: this.state.controlledDate,
                visits: this.state.visits.value,
                negos: this.state.negos.value,
                proposals: this.state.proposals.value,
                deals: this.state.deals.value
            };
            saveRegistrationData(this.props.baseUrl, registrationForm)
                .then(response => {
                    var alert = {
                        message: response.data,
                        open: true
                    };
                    this.setState({
                        alert: alert
                    });
                }
            ).
                catch(err => {
                    var alert = {
                        message: err.data,
                        open: true
                    };
                    this.setState({
                        alert: alert
                    });
                })
        }
    }

    handleRequestSnackBarClose() {
        var alert = {
            message: "",
            open: false
        };
        this.setState({
            alert: alert
        });
    }

;

    visitsTextChanged(value) {
        this.state.visits.value = value;
        this.ensureRequiredFieldIsFilledIn(this.state.visits);
        this.ensureHigherThan(this.state.negos, this.state.visits, "Visits should be higher than nego's");

        this.setState({
            visits: this.state.visits
        })
    }

    negosTextChanged(value) {
        this.state.negos.value = value;
        this.ensureRequiredFieldIsFilledIn(this.state.negos);
        this.ensureHigherThan(this.state.negos, this.state.visits, "Visits should be higher than nego's");
        this.ensureHigherThan(this.state.proposals, this.state.negos, "Nego's should be higher than Proposals");

        this.setState({
            negos: this.state.negos
        })
    }

    proposalsTextChanged(value) {
        this.state.proposals.value = value;
        this.ensureRequiredFieldIsFilledIn(this.state.proposals);
        this.ensureHigherThan(this.state.proposals, this.state.negos, "Nego's should be higher than Proposals");
        this.ensureHigherThan(this.state.deals, this.state.proposals, "Proposals should be higher than Deals");

        this.setState({
            proposals: this.state.proposals
        })
    }

    dealsTextChanged(value) {
        this.state.deals.value = value;
        this.ensureRequiredFieldIsFilledIn(this.state.deals);
        this.ensureHigherThan(this.state.deals, this.state.proposals, "Proposals should be higher than Deals");

        this.setState({
            deals: this.state.deals
        })
    }

    render() {
        return (
            <App>
                <div>
                    <div className="row">
                        <div className="col s12">
                            <h5 className="header">Register the sales of the day
                            </h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 m6">
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
                        hintText="Nego's"
                        floatingLabelText="Total nego's of the day"
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
                            secondary={true}
                            style={{margin: 12}}
                            onMouseUp={this.submitSales.bind(this)}
                        />
                    </div>
                    <Snackbar
                        open={this.state.alert.open}
                        message={this.state.alert.message}
                        autoHideDuration={4000}
                        onRequestClose={this.handleRequestSnackBarClose.bind(this)}
                    />
                </div>
            </App>
        )
    }
}

Registration.propTypes = {
    user: React.PropTypes.object,
    baseUrl: React.PropTypes.string
};

export default Registration;