IssueHeader = React.createClass({

  render() {
    return (
      <div className="card-table-header issue-card-table-header">
        <div className="issue-summary-col issue-summary-col-1" style={{padding:0,margin:0}}>
          Facility
        </div>
        <div className="issue-summary-col issue-summary-col-2" style={{padding:0,margin:0}}>
          Status&nbsp;&nbsp;Issue
        </div>
        <div className="issue-summary-col issue-summary-col-4" style={{padding:0,margin:0}}>
          Requested
        </div>
        <div className="issue-summary-col issue-summary-col-3" style={{padding:0,margin:0}}>
          Contact
        </div>
      </div>
    )
  }

});