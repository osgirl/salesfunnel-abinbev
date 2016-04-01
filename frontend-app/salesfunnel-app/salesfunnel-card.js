import React from 'react';
import { getTeamSalesFunnelData, getUserSalesFunnelData } from '../helpers/api-calls.js';
import SalesfunnelHeader from './salesfunnel-header.js';
import PeriodFilter from './filters/period-filter.js';
import TeamFilter from './filters/team-filter.js';
import UserFilter from './filters/user-filter.js';
import _ from 'lodash';

class SalesfunnelCard extends React.Component {

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

    render() {
        return (
            <div>
                <SalesfunnelHeader
                    header={this.props.header}
                />
                <PeriodFilter
                    periodData={this.props.periodData}
                    callback={this.changePeriod}
                />
                <TeamFilter
                    teamData={this.props.teamData}
                    callback={this.changeTeamName}
                />
                <UserFilter
                    filteredUsers={this.state.filteredUsers}
                    selectedUser={this.state.chosenUser}
                    callback={this.changeUser}
                />

                <div className="row">
                    {!this.state.noData && <div id="my_chart" />}
                    {this.state.noData && <p>No data found</p>}
                </div>
            </div>

        )
    }
}

SalesfunnelCard.propTypes = {
    header: React.PropTypes.string.isRequired,
    noData: React.PropTypes.bool,
    teamData: React.PropTypes.object,
    periodData: React.PropTypes.object.isRequired,
    userData: React.PropTypes.object,
    data: React.PropTypes.object,
    baseUrl: React.PropTypes.string.isRequired
};
export default SalesfunnelCard;