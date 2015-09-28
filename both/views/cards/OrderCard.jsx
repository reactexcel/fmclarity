OrderCard = React.createClass({

  handleNameChange(event) {
    this.props.handleFieldChange('name',event.target.value);
  },

  handleAddressChange(event) {
    this.props.handleFieldChange('address',event.target.value);
  },

  render() {
      var issue = this.props.item;
      var facility = issue.facility;
      var contact = issue.contact;
      var status = issue.status;
      var statusClass = 
        status=='New'?'danger':
        status=='Issued'?'warning':
        status=='Open'?'info':
        status=='Closed'?'success':'default';

      return (
        <div>
        <div className="card-header">
          <div className="issue-status pull-left" style={{width:"80px","textAlign":"left"}}>
            <span className={"label label-"+statusClass}>{status}</span><br/>
            {issue.urgent?<span className="label label-danger" style={{position:"relative",top:"2px"}}>URGENT</span>:null}
          </div>
          <div className="issue-info">
            <a href="#">
              {issue.name}
            </a>
            <br/>
            <small>
              {facility.name}
            </small>
            <small>
              {contact.name}&nbsp;&nbsp;
              <i className="fa fa-envelope"></i>&nbsp;&nbsp;
              {contact.email}&nbsp;&nbsp;
              <i className="fa fa-phone"></i>&nbsp;&nbsp;
              {contact.phone}
            </small>
          </div>
          <div className="issue-description">
            <br/>
            <small>
              {issue.description}
            </small>
          </div>
          <div className="issue-date">
            <div style={{fontSize:"30px"}}>19</div>
            <div style={{fontSize:"15px"}}>Oct</div>
          </div>
          <div className="issue-thumbnail pull-right">
                <img alt="image" src={"img/issue-"+issue.thumb+".jpg"} />
          </div>
        </div>
        <div className="card-body">
          <div className="issue-image pull-left">
                <img alt="image" src={"img/issue-"+issue.thumb+".jpg"} />
          </div>
          <div className="issue-type pull-right">
            <span className="label label-warning">{issue.type}</span>
          </div>
          <form style={{float:"left",paddingLeft:"20px"}} className="form-horizontal">
            <input className="form-control" value={issue.name} onChange={this.handleNameChange}/>
            <input className="form-control" value={issue.address} onChange={this.handleAddressChange}/>
            {/*<ContactForm contact={issue.contact} />*/}
          </form>
          <span className="pie" style={{display:"none"}}>0.52,1.041</span><svg class="peity" height="16" width="16"><path d="M 8 8 L 8 0 A 8 8 0 0 1 14.933563796318165 11.990700825968545 Z" fill="#1ab394"></path><path d="M 8 8 L 14.933563796318165 11.990700825968545 A 8 8 0 1 1 7.999999999999998 0 Z" fill="#d7d7d7"></path></svg>
        </div>
      </div>
    )
  }

});