import React from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import RegistrationReport from './registration-report.js';

class ReportCard extends React.Component {

    render() {
        return (
            <Tabs>
                <Tab label="Visits overview">
                    <RegistrationReport visitReport={this.props.visitReport} />
                </Tab>
                <Tab label="Salesfunnel">
                    <p>Test</p>
                </Tab>
            </Tabs>
        )
    }
}

ReportCard.propTypes = {
    visitReport: React.PropTypes.array
};
export default ReportCard;