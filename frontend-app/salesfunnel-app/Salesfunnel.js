import React from 'react';

class Salesfunnel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            noData:false
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col s12">
                        <h5 className="header">{this.props.header}
                        </h5>
                    </div>
                </div>
                {this.state.noData && <p>No data yet for this team</p>}
                <div className="row">
                    <div id="my_chart">
                    </div>
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

export default Salesfunnel;