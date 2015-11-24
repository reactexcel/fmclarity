IssuePriority = React.createClass({
  render() {
    var priority = this.props.value;
    return (
      <span title={priority} style={{fontSize:"20px",position:"relative",top:"3px"}}>
        <i className={"fa fa-circle"+(priority=='Scheduled'?'-o':'')+" priority-"+(priority)}></i>
      </span>
    )
  }
})

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
      // note: in order to reduce the overhead of loading the creator
      // supplier etc - we should denormalise the tables
      // that is to say - any field we want to use in this context
      // get saved directly in the issue doucment (thumbnail etc)
      return {
        ready:true,
        issue:issue,
        facility:issue.getFacility(),
        creator:issue.getCreator(),
        supplier:issue.getSupplier(),
        status:issue.status,
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
        var creator = this.data.creator;
        var supplier = this.data.supplier;
        return (
        <div className={"issue-summary issue-status-"+status}>
          
          <div className="issue-summary-col issue-summary-col-1">
            <IssuePriority value={issue.priority} />
            {/*<ContactAvatarSmall item={creator} />*/}
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
              {facility?facility.location:null}
            </span>
          </div>
          <div className="issue-summary-col issue-summary-col-4">
            <span className="issue-summary-name">{issue.name}</span>
            {/*<span className="issue-summary-description">{issue.description}</span>*/}
          </div>
          <div className="issue-summary-col issue-summary-col-5">
            {moment(issue.createdAt).fromNow()}
          </div>
        </div>
      )
    }
  }

});