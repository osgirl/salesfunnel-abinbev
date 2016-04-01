import React from 'react';

class SalesfunnelHeader extends React.Component {

    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <h5 className="header">{this.props.header}
                    </h5>
                </div>
            </div>
        )
    }
}

SalesfunnelHeader.propTypes = {
    header: React.PropTypes.string.isRequired
};
export default SalesfunnelHeader;