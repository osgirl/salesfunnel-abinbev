import React from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import RegistrationReport from './registration-report.js';
import SalesfunnelCard from '../salesfunnel-app/salesfunnel-card.js';
import { getSalesfunnelData } from '../helpers/api-calls.js';

class ReportCard extends React.Component {

    render() {
        return (
            <RegistrationReport visitReport={this.props.visitReport} />
        )
    }
}

ReportCard.propTypes = {
    visitReport: React.PropTypes.array.isRequired,
    baseUrl: React.PropTypes.string.isRequired
};
export default ReportCard;