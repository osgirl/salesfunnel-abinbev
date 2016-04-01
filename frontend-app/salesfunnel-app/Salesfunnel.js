import React from 'react';
import App from '../common/App.js';
import SalesfunnelCard from './salesfunnel-card.js';

class Salesfunnel extends React.Component {

    render() {
        return (
            <App>
                <SalesfunnelCard
                {...this.props}
                    header= {this.props.header}
                    noData= {this.props.noData}
                    teamData= {this.props.teamData}
                    periodData= {this.props.periodData}
                    userData= {this.props.userData}
                    data= {this.props.data}
                    baseUrl={this.props.baseUrl}>
                </SalesfunnelCard>
            </App>
        )
    }
}

Salesfunnel.propTypes = {
    header: React.PropTypes.string,
    noData: React.PropTypes.bool,
    teamData: React.PropTypes.object,
    periodData: React.PropTypes.object,
    userData: React.PropTypes.object,
    data: React.PropTypes.object,
    baseUrl: React.PropTypes.string
};

export default Salesfunnel;