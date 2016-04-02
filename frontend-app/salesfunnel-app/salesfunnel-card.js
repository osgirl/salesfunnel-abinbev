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
        this._handleResult = this._handleResult.bind(this);
        this.state = {
            noData: this.props.noData,
            chosenTeam: this.props.teamData.teamRef,
            chosenPeriod: this.props.periodData.periodRef,
            chosenUser: undefined,
            filteredUsers: this.props.userData.users,
            data: this.props.data
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
                        noData: true,
                        data: undefined
                    });
                } else {
                    this.setState({
                        noData: false,
                        data: response.data
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
                        chosenPeriod: periodRef,
                        data: undefined
                    });
                } else {
                    this.setState({
                        noData: false,
                        chosenPeriod: periodRef,
                        data: response.data
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
                        noData: true,
                        data: undefined
                    });
                } else {
                    this.setState({
                        noData: false,
                        data: response.data
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
        this.funnelChart = window.getFunnelChart();
        if (!this.props.data) {
            var promise = this.state.chosenUser ?
                getUserSalesFunnelData(this.props.baseUrl, this.state.chosenUser, this.state.chosenPeriod) :
                getTeamSalesFunnelData(this.props.baseUrl, this.state.chosenTeam, this.state.chosenPeriod);

            promise
                .then(response => {
                    this._handleResult(response.data);
                }
            );
        } else {
            this._handleResult(this.props.data)
        }


    }

    _handleResult(data) {
        if (!data || data.visits === 0) {
            this.setState({
                noData: true,
                data: undefined
            })
        } else {
            this.setState({
                noData: false,
                data: data
            });
            this.funnelChart.init(this.state.data);
            this.updateFunnelChart(this.state.data)
        }
    }

    componentWillReceiveProps() {
        if (!this.props.data) {
            var promise = this.state.chosenUser ?
                getUserSalesFunnelData(this.props.baseUrl, this.state.chosenUser, this.state.chosenPeriod) :
                getTeamSalesFunnelData(this.props.baseUrl, this.state.chosenTeam, this.state.chosenPeriod);

            promise
                .then(response => {
                    this._handleResult(response.data);
                }
            );
        } else {
            this._handleResult(this.props.data)
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
    teamData: React.PropTypes.object.isRequired,
    periodData: React.PropTypes.object.isRequired,
    userData: React.PropTypes.object.isRequired,
    data: React.PropTypes.object,
    baseUrl: React.PropTypes.string.isRequired
};
export default SalesfunnelCard;