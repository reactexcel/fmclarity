OrderCardTableHeader = React.createClass({

  render() {
    return (
      <div className="card-table-header issue-card-table-header">
        <div className="issue-card-status-col">
          Status
        </div>
        <div className="issue-card-info-col">
          Issue
        </div>
        <div className="issue-card-contact-col">
          Requester
        </div>
        <div className="issue-card-contact-col">
          Supplier
        </div>
        <div className="issue-card-date-col">
          Issued
        </div>
        <div className="issue-card-date-col">
          Due in
        </div>
      </div>
    )
  }

});