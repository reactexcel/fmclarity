IssueHeader = React.createClass({

  render() {
    return (
      <div className="card-table-header issue-card-table-header">
        <div className="issue-summary-col issue-summary-col-1">
          <div>Creator</div>
          <div style={{paddingLeft:"14px",position:"relative",top:"-10px",fontSize:"20px"}}><i className="fa fa-caret-down"></i></div>
        </div>
        <div className="issue-summary-col issue-summary-col-2">
          Contractor
        </div>
        <div className="issue-summary-col issue-summary-col-3">
          Status
        </div>
        <div className="issue-summary-col issue-summary-col-4">
          Facility
        </div>
        <div className="issue-summary-col issue-summary-col-5">
          Last update
        </div>
        <div className="issue-summary-col issue-summary-col-6">
          Issue
        </div>
      </div>
    )
  }

});