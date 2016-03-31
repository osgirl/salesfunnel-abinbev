import React from 'react';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

class RegistrationReport extends React.Component {

    _createVisitReportItems(visitReport) {
        return visitReport.map((visitReportItem, index) => {
            return (
                <TableRow key={index}>
                    <TableRowColumn>{visitReportItem.period}</TableRowColumn>
                    <TableRowColumn>{visitReportItem.nrOfVisits}</TableRowColumn>
                </TableRow>
            )
        });

    }

    render() {
        var visitReportItems = this._createVisitReportItems(this.props.visitReport);
        return (
            <div className="card grey lighten-5">
                <div className="container">
                    <div className="row">
                        <div className="col s12">
                            <h5 className="header">Visits registered
                            </h5>
                        </div>
                    </div>
                    <div className="row">
                        <Table selectable={false}>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    <TableHeaderColumn>Week number</TableHeaderColumn>
                                    <TableHeaderColumn>Total visits</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>{visitReportItems}</TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}

RegistrationReport.propTypes = {
    visitReport: React.PropTypes.array
};

export default RegistrationReport;