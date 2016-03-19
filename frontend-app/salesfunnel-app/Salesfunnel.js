import React from 'react';
import TeamDropDown from './team-dropdown.js';
import PeriodDropDown from './period-dropdown.js';
import { getSalesFunnelData } from '../helpers/api-calls.js';
import App from '../common/App.js';

class Salesfunnel extends React.Component {

    constructor(props) {
        super(props);
        this.changeTeamName = this.changeTeamName.bind(this);
        this.changePeriod = this.changePeriod.bind(this);
        this.state = {
            noData: this.props.noData,
            chosenTeam: this.props.teamData.teamRef,
            chosenPeriod: this.props.periodData.periodRef
        };
    }

    changeTeamName(teamRef) {
        getSalesFunnelData(this.props.baseUrl, teamRef, this.state.chosenPeriod)
            .then(response => {
                if (response.data.visits === 0) {
                    this.setState({
                        noData: true,
                        chosenTeam: teamRef
                    });
                } else {
                    this.setState({
                        noData: false,
                        chosenTeam: teamRef
                    });
                    this.funnelChart.updateData(response.data);
                }
            }
        );
    }

    changePeriod(periodRef) {
        getSalesFunnelData(this.props.baseUrl, this.state.chosenTeam, periodRef)
            .then(response => {
                if (response.data.visits === 0) {
                    this.setState({
                        noData: true,
                        chosenPeriod: periodRef
                    });
                } else {
                    this.setState({
                        noData: false,
                        chosenPeriod: periodRef
                    });
                    this.funnelChart.updateData(response.data);
                }
            }
        );
    }

    render() {
        return (
            <App>
                <div>
                    <div className="row">
                        <div className="col s12">
                            <h5 className="header">{this.props.header}
                            </h5>
                        </div>
                    </div>
                {this.state.noData && <p>No data yet for this team</p>}
                    <div className = "row">
                        <div className = "col s6">
                            <TeamDropDown
                                callback={this.changeTeamName}
                                teamData={this.props.teamData}
                            />
                        </div>
                        <div className = "col s6">
                            <PeriodDropDown
                                callback={this.changePeriod}
                                periodData={this.props.periodData}
                            />
                        </div>
                    </div>
                    <div className="row">
                    {!this.state.noData && <div id="my_chart" />}
                    </div>
                </div>
            </App>
        )
    }

    componentDidMount() {
        if (this.props.data.visits === 0) {
            this.setState({
                noData: true
            })
        } else {
            this.funnelChart = window.getFunnelChart();
            this.funnelChart.init(this.props.data);
        }
    }
}

export default Salesfunnel;