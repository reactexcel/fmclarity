IssueSummary = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    var issue = this.props.item;
    if(!issue) {
      return {
        ready:false
      }
    }
    else {
      var status = issue.status;
      var statusClass = 
        status=='New'?'success':
        status=='Issued'?'warning':
        status=='Open'?'danger':
        status=='Closed'?'info':'';

      return {
        ready:true,
        issue:issue,
        facility:issue.getFacility(),
        contact:issue.getContact(),
        supplier:issue.getContractor(),
        status:status,
        statusClass:statusClass
      }
    }
  },

  updateField(field) {
    var $this = this;
    // returns a function that modifies 'field'
    return function(event) {
      $this.item[field] = event.target.value;
      $this.saveItem();
    }
  },

  render() {
      if(this.data.ready) {
        var issue = this.item = this.data.issue;
        var facility = this.data.facility;
        var contact = this.data.contact;
        var supplier = this.data.supplier;
        var statusClass = this.data.statusClass;
        return (
        <div className={"issue-summary issue-status-"+status}>
          <div className="issue-summary-col issue-summary-col-1">
            <span className="issue-summary-facility-name">
              {facility.name}
            </span>
          </div>
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
            {issue.status=='New'?null:
              <ContactCard item={supplier} view="avatar" />
            }
          </div>
        </div>
      )
    }
  }

});