IssueHeader = React.createClass({

  render() {
    return (
      <div className="card-table-header issue-card-table-header">
        <div className="issue-summary-col issue-summary-col-1">
          Facility
        </div>
        <div className="issue-summary-col issue-summary-col-2">
          Status&nbsp;&nbsp;Issue
        </div>
        <div className="issue-summary-col issue-summary-col-4">
          Requested
        </div>
        <div className="issue-summary-col issue-summary-col-3">
          Contact
        </div>
      </div>
    )
  }

});