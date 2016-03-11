import React from 'react';

class Salesfunnel extends React.Component {
    clickHandler() {
        alert(this.props.msg)
    }

    render() {
        return React.createElement('button', { onClick: this.clickHandler.bind(this)}, this.props.msg)
    }
}

export default Salesfunnel;