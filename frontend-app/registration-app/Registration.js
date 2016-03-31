import React from 'react';
import Snackbar from 'material-ui/lib/snackbar';
import { saveRegistrationData, getVisitReport } from '../helpers/api-calls.js';
import App from '../common/App.js';
import RegistrationCard from './registration-card.js';
import RegistrationReport from './registration-report.js';

class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.refreshVisitReport.bind(this);

        this.state = {
            alert: {
                message: "",
                open: false
            },
            visitReport: this.props.visitReport
        };
    }

    submitSales(registrationForm) {
        saveRegistrationData(this.props.baseUrl, registrationForm)
            .then(response => {
                var alert = {
                    message: response.data,
                    open: true
                };
                this.setState({
                    alert: alert
                });
                this.refreshVisitReport()
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

    refreshVisitReport() {
        getVisitReport(this.props.baseUrl)
            .then(visitReport => {
                this.setState({
                    visitReport: visitReport.data
                })
            });

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

    render() {
        return (
            <App>
                <div>
                    <RegistrationCard onSubmitSales={this.submitSales.bind(this)} />
                    <RegistrationReport visitReport={this.state.visitReport} />
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
    baseUrl: React.PropTypes.string,
    visitReport: React.PropTypes.array
};

export default Registration;