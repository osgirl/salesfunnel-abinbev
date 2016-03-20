import React from 'react';
import TeamDropDown from './team-dropdown.js';
import PeriodDropDown from './period-dropdown.js';
import { getTeamSalesFunnelData, getUserSalesFunnelData } from '../helpers/api-calls.js';
import App from '../common/App.js';
import UsersAutoCompleteDropDown from './users-autocomplete-dropdown.js';
import _ from 'lodash';

class Salesfunnel extends React.Component {

    constructor(props) {
        super(props);
        this.changeTeamName = this.changeTeamName.bind(this);
        this.changePeriod = this.changePeriod.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.state = {
            noData: this.props.noData,
            chosenTeam: this.props.teamData.teamRef,
            chosenPeriod: this.props.periodData.periodRef,
            chosenUser: undefined,
            filteredUsers: this.props.userData.users
        };
    }

    changeTeamName(teamRef) {
        getTeamSalesFunnelData(this.props.baseUrl, teamRef, this.state.chosenPeriod)
            .then(response => {
                this.setState({
                    chosenTeam: teamRef,
                    filteredUsers: updateAndReturnFilteredUsers(this.props.userData.users),
                    chosenUser: undefined
                });
                if (!response.data || response.data.visits === 0) {
                    this.setState({
                        noData: true
                    });
                } else {
                    this.setState({
                        noData: false
                    });
                    this.updateFunnelChart(response.data);
                }

                function updateAndReturnFilteredUsers(allUsers) {
                    return teamRef === 'NA' ?
                        allUsers :
                        _.filter(allUsers, {teamRef: teamRef});
                }
            }
        );

    }

    changePeriod(periodRef) {
        var promise = this.state.chosenUser ?
            getUserSalesFunnelData(this.props.baseUrl, this.state.chosenUser, periodRef) :
            getTeamSalesFunnelData(this.props.baseUrl, this.state.chosenTeam, periodRef);

        promise
            .then(response => {
                if (!response.data || response.data.visits === 0) {
                    this.setState({
                        noData: true,
                        chosenPeriod: periodRef
                    });
                } else {
                    this.setState({
                        noData: false,
                        chosenPeriod: periodRef
                    });
                    this.updateFunnelChart(response.data);
                }
            }
        );
    }

    changeUser(userRef) {
        getUserSalesFunnelData(this.props.baseUrl, userRef, this.state.chosenPeriod)
            .then(response => {
                this.setState({
                    chosenUser: userRef
                });
                if (!response.data || response.data.visits === 0) {
                    this.setState({
                        noData: true
                    });
                } else {
                    this.setState({
                        noData: false
                    });
                    this.updateFunnelChart(response.data)
                }
            })
    }

    updateFunnelChart(funnelChartData) {
        var scrollPosition = {
            x: window.scrollX,
            y: window.scrollY
        };
        this.funnelChart.updateData(funnelChartData);
        window.scrollTo(scrollPosition.x, scrollPosition.y);
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
                    <div className = "row">
                        <div className = "col s4">
                            <p> Date range: </p>
                        </div>
                        <div className = "col s8">
                            <PeriodDropDown
                                callback={this.changePeriod}
                                periodData={this.props.periodData}
                            />
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col s4">
                            <p> Team: </p>
                        </div>
                        <div className = "col s8">
                            <TeamDropDown
                                callback={this.changeTeamName}
                                teamData={this.props.teamData}
                            />
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col s4">
                            <p> Search for a specific user: </p>
                        </div>
                        <div className = "col s8">
                            <UsersAutoCompleteDropDown
                                callback={this.changeUser}
                                users={this.state.filteredUsers}
                                selectedUser={this.state.chosenUser}
                            >
                            </UsersAutoCompleteDropDown>
                        </div>
                    </div>
                    <div className="row">
                    {!this.state.noData && <div id="my_chart" />}
                    {this.state.noData && <p>No data found</p>}
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