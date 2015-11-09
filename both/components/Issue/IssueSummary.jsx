IssueSummary = React.createClass({

  updateField(field) {
    var $this = this;
    // returns a function that modifies 'field'
    return function(event) {
      $this.item[field] = event.target.value;
      $this.saveItem();
    }
  },

  render() {
      var issue = this.item = this.props.item;
      var facility = issue._facility;
      var contact = issue.contact;
      var supplier = issue.supplier;
      var status = issue.status;


      var statusClass = 
        status=='New'?'success':
        status=='Issued'?'warning':
        status=='Open'?'danger':
        status=='Closed'?'info':'';

    var shouldShowFacility = true;
    var selectedFacility = Session.get("selectedFacility");
    if(selectedFacility&&selectedFacility.address) {
      shouldShowFacility = false;
    }

      return (
        <div className={"issue-summary issue-status-"+status}>
          {!shouldShowFacility?null:
            <div className="issue-summary-col issue-summary-col-1">
              <span className="issue-summary-facility-name">
                {facility.name}
              </span>
            </div>
          }
          <div className="issue-summary-col issue-summary-col-2">
            <span style={{marginRight:"2px"}} className={"label dropdown-label label-"+statusClass}>{issue.status}</span>
            {issue.priority!='Urgent'?null:
              <i className="fa fa-exclamation-triangle text-danger" style={{fontSize:"20px",position:"relative",top: "4px"}}></i>
            }
            <span className="issue-summary-name">{issue.name}</span>
            <span className="issue-summary-description">{issue.description}</span>
          </div>
          <div className="issue-summary-col issue-summary-col-4">
            {moment(issue.createdAt).fromNow()}
          </div>
          <div className="issue-summary-col issue-summary-col-3">
            {status=='New'?null:
              <ContactCard item={supplier} view="avatar" />
            }
          </div>
        </div>
    )
  }

});