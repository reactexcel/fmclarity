IssueHeader = React.createClass({

  render() {
    return (
      <div className="card-table-header issue-card-table-header">
        <div className="issue-card-status-col" style={{padding:0}}>
          Status
        </div>
        <div className="issue-card-info-col" style={{padding:0}}>
          Issue
        </div>
        <div className="issue-card-contact-col" style={{padding:0}}>
          Requester
        </div>
        <div className="issue-card-contact-col" style={{padding:0}}>
          Supplier
        </div>
        <div className="issue-card-date-col" style={{padding:0}}>
          Issued
        </div>
        <div className="issue-card-date-col" style={{padding:0}}>
          Due in
        </div>
      </div>
    )
  }

});