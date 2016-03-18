import React from 'react';
import { initMaterialUi } from '../common/mui-theme.js';
import TeamDropDown from './team-dropdown.js';
import { getSalesFunnelData } from '../helpers/api-calls.js';

class Salesfunnel extends React.Component {

    constructor(props) {
        super(props);
        this.changeTeamName = this.changeTeamName.bind(this);

        this.state = {
            noData: this.props.noData
        };

    }

    changeTeamName(teamRef) {
        getSalesFunnelData(this.props.baseUrl, teamRef)
            .then(response => {
                console.log(JSON.stringify(response));
                if (response.data.visits === 0) {
                    this.setState({
                        noData: true
                    });
                } else {
                    this.setState({
                        noData: false
                    });
                    this.funnelChart.updateData(response.data);
                }
            }
        );
    }

    render() {
        console.log("teamData: " + JSON.stringify(this.props.teamData));
        return (
            <div>
                <div className="row">
                    <div className="col s12">
                        <h5 className="header">{this.props.header}
                        </h5>
                    </div>
                </div>
                {this.state.noData && <p>No data yet for this team</p>}
                <div className = "row">
                    <div className = "col s12 m6 l3">
                        <TeamDropDown
                            callback={this.changeTeamName}
                            teamData={this.props.teamData}
                        />
                    </div>
                </div>
                <div className="row">
                    {!this.state.noData && <div id="my_chart" />}
                </div>
            </div>
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

export default initMaterialUi(Salesfunnel);