IssueSummary = React.createClass({

  render() {
      var issue = this.props.item;
      var facility = issue.facility;
      var contact = issue.contact;
      var supplier = issue.supplier;
      var status = issue.status;
      var statusClass = 
        status=='New'?'danger':
        status=='Issued'?'warning':
        status=='Open'?'info':
        status=='Closed'?'success':'default';

      return (
        <div>
          <div className="issue-card-status-col">
            <span className={"label label-"+statusClass}>{status}</span>
            {
              issue.urgent?<i className="fa fa-exclamation-triangle text-danger" style={{fontSize:"20px",position:"relative",top: "4px",left: "2px"}}></i>
              :null
            }
          </div>
          <div className="issue-card-info-col">
            <a className="issue-title" href="#">
              {issue.name}
            </a>
            <br/>
            <span>
              {facility.name}
            </span>
          </div>
          <div className="issue-card-contact-col">
            <ContactCard contact={contact} view="2-line" />
          </div>
          {status=="Issued"||status=="Closed"?
            <div className="issue-card-contact-col">
              <ContactCard contact={supplier} view="2-line" />
            </div>:<i className="fa fa-search"></i>
          }
          <div className="issue-card-date-col">
            <span style={{fontSize:"15px"}}><i className="fa fa-calendar"></i>19-Oct</span>
          </div>
          <div className="issue-card-date-col">
            <span style={{fontSize:"15px"}} className="label label-info">2 Days</span>
          </div>
        </div>
    )
  }

});