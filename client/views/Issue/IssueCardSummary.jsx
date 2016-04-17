

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
      // note: in order to reduce the overhead of loading the owner
      // supplier etc - we should denormalise the tables
      // that is to say - any field we want to use in this context
      // get saved directly in the issue doucment (thumbnail etc)
      return {
        ready:true,
        issue:issue,
        facility:issue.getFacility(),
        owner:issue.getOwner(),
        supplier:issue.getSupplier(),
        status:issue.status,
        timeframe:issue.getTimeframe()
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
        var owner = this.data.owner;
        var supplier = this.data.supplier;
        var timeframe = this.data.timeframe;
        var dueDate = issue.dueDate?moment(issue.dueDate):null;
        return (
        <div className={"issue-summary issue-status-"+status}>
          
          <div className="issue-summary-col issue-summary-col-1">
            <IssuePriority issue={issue} />
            {/*<ContactAvatarSmall item={owner} />*/}
          </div>
          {/*}
          <div className="issue-summary-col issue-summary-col-2">
            <ContactAvatarSmall item={supplier} />
          </div>
          */}
          <div className="issue-summary-col issue-summary-col-2">
            <span style={{marginRight:"2px"}} className={"label dropdown-label label-"+issue.status}>{issue.status}</span>
          </div>
          <div className="issue-summary-col issue-summary-col-3">
            <span className="issue-summary-facility-name">
              {facility?facility.name:null}
            </span>
          </div>
          <div className="issue-summary-col issue-summary-col-4">
            <span className="issue-summary-name">{supplier?supplier.name:''}</span>
          </div>
          <div className="issue-summary-col issue-summary-col-5">
            {issue.dueDate&&issue.status!=Issues.STATUS_CLOSED?
              <span className={dueDate.isBefore()?"text-overdue":""}>{dueDate.fromNow()}</span>
            :null}
          </div>
          <div className="issue-summary-col issue-summary-col-6">
            <span className="issue-summary-name">{issue.name}</span>
            {/*<span className="issue-summary-description">{issue.description}</span>*/}
          </div>
        </div>
      )
    }
  }

});