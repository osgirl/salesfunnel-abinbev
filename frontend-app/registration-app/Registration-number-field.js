import React from 'react';
import TextField from 'material-ui/lib/text-field';

export class RegistrationNumberField extends React.Component {

    constructor(props) {
        super(props);
    }

    textChanged(event) {
        this.props.textChanged(event.target.value);
    }

    render() {
        return (
            <div className="row">
                <div className="col s12 m6">
                    <p>{this.props.hintText}:</p>
                </div>
                <div className="col s12 m6">
                    <TextField
                        id={this.props.id}
                        hintText={this.props.hintText}
                        floatingLabelText={this.props.floatingLabelText}
                        errorText={this.props.errorText}
                        onBlur={this.textChanged.bind(this)}
                        type='number'
                    />
                </div>
            </div>
        )
    }
}
