import React from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import RegistrationReport from './registration-report.js';
import SalesfunnelCard from '../salesfunnel-app/salesfunnel-card.js';
import { getSalesfunnelData } from '../helpers/api-calls.js';

class ReportCard extends React.Component {

    constructor(props) {
        super(props);
        this._createSalesfunnelCard = this._createSalesfunnelCard.bind(this);
        this.salesfunnelCardActive = this.salesfunnelCardActive.bind(this);
        this.visitReportActive = this.visitReportActive.bind(this);

        this.TAB_STATE = {
            VISIT_REPORT: "VISIT_REPORT",
            SALES_FUNNEL: "SALES_FUNNEL"
        };

        this.activeTab = this.TAB_STATE.VISIT_REPORT;

        this.state = {
            salesfunnelCard: undefined
        }

    }

    salesfunnelCardActive() {
        this.activeTab = this.TAB_STATE.SALES_FUNNEL;
        this._createSalesfunnelCard();
    }

    visitReportActive() {
        this.activeTab = this.TAB_STATE.VISIT_REPORT;
    }

    componentWillReceiveProps() {
        console.log("componentWillReceiveProps state: " + this.activeTab)
        if (this.activeTab === this.TAB_STATE.SALES_FUNNEL) {
            console.log("createSalesFunnelCard!: ")
            this._createSalesfunnelCard();
        }
    }

    _createSalesfunnelCard() {
        getSalesfunnelData(this.props.baseUrl)
            .then(response => {
                var salesfunnelData = response.data;
                console.log("newData: " + JSON.stringify(salesfunnelData.registrationData));
                this.setState({
                    salesfunnelCard: <SalesfunnelCard
                        header= "Consult your own sales graphs"
                        periodData= {salesfunnelData.periodData}
                        teamData= {salesfunnelData.teamData}
                        userData= {salesfunnelData.userData}
                        data = {salesfunnelData.registrationData}
                        baseUrl={this.props.baseUrl}>
                    </SalesfunnelCard>
                })
            });
    }

    render() {
        return (
            <Tabs>
                <Tab
                    label="Visits overview"
                    onActive={this.visitReportActive}
                >
                    <RegistrationReport visitReport={this.props.visitReport} />
                </Tab>
                <Tab
                    label="Salesfunnel"
                    onActive={this.salesfunnelCardActive}
                >
                    <div className="card grey lighten-5">
                        <div className="container">
                            <div className="row">
                                {this.state.salesfunnelCard}
                            </div>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        )
    }
}

ReportCard.propTypes = {
    visitReport: React.PropTypes.array.isRequired,
    baseUrl: React.PropTypes.string.isRequired
};
export default ReportCard;