Discussion = React.createClass({
  render() {
    return (
    <div className="social-feed-box">

                            <div className="pull-right social-action dropdown">
                                <button data-toggle="dropdown" className="dropdown-toggle btn-white">
                                    <i className="fa fa-angle-down"></i>
                                </button>
                                <ul className="dropdown-menu m-t-xs">
                                    <li><a href="#">Config</a></li>
                                </ul>
                            </div>
                            <div className="social-avatar">
                                <a href="" className="pull-left">
                                    <img alt="image" src="img/a6.jpg"/>
                                </a>
                                <div className="media-body">
                                    <a href="#">
                                        Andrew Williams
                                    </a>
                                    <small className="text-muted">Today 4:21 pm - 12.06.2014</small>
                                </div>
                            </div>
                            <div className="social-body">
                                <p>
                                    Many desktop publishing packages and web page editors now use Lorem Ipsum as their
                                    default model text, and a search for 'lorem ipsum' will uncover many web sites still
                                    in their infancy. Packages and web page editors now use Lorem Ipsum as their
                                    default model text.
                                </p>
                                <p>
                                    Lorem Ipsum as their
                                    default model text, and a search for 'lorem ipsum' will uncover many web sites still
                                    in their infancy. Packages and web page editors now use Lorem Ipsum as their
                                    default model text.
                                </p>
                                <img src="img/gallery/11.jpg" className="img-responsive"/>
                                <div className="btn-group">
                                    <button className="btn btn-white btn-xs"><i className="fa fa-thumbs-up"></i> Like this!</button>
                                    <button className="btn btn-white btn-xs"><i className="fa fa-comments"></i> Comment</button>
                                    <button className="btn btn-white btn-xs"><i className="fa fa-share"></i> Share</button>
                                </div>
                            </div>
                            <div className="social-footer">
                                <div className="social-comment">
                                    <a href="" className="pull-left">
                                        <img alt="image" src="img/a1.jpg"/>
                                    </a>
                                    <div className="media-body">
                                        <a href="#">
                                            Andrew Williams
                                        </a>
                                        Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words.
                                        <br/>
                                        <a href="#" className="small"><i className="fa fa-thumbs-up"></i> 26 Like this!</a> -
                                        <small className="text-muted">12.06.2014</small>
                                    </div>
                                </div>

                                <div className="social-comment">
                                    <a href="" className="pull-left">
                                        <img alt="image" src="img/a2.jpg"/>
                                    </a>
                                    <div className="media-body">
                                        <a href="#">
                                            Andrew Williams
                                        </a>
                                        Making this the first true generator on the Internet. It uses a dictionary of.
                                        <br/>
                                        <a href="#" className="small"><i className="fa fa-thumbs-up"></i> 11 Like this!</a> -
                                        <small className="text-muted">10.07.2014</small>
                                    </div>
                                </div>

                                <div className="social-comment">
                                    <a href="" className="pull-left">
                                        <img alt="image" src="img/a8.jpg"/>
                                    </a>
                                    <div className="media-body">
                                        <a href="#">
                                            Andrew Williams
                                        </a>
                                        Making this the first true generator on the Internet. It uses a dictionary of.
                                        <br/>
                                        <a href="#" className="small"><i className="fa fa-thumbs-up"></i> 11 Like this!</a> -
                                        <small className="text-muted">10.07.2014</small>
                                    </div>
                                </div>

                                <div className="social-comment">
                                    <a href="" className="pull-left">
                                        <img alt="image" src="img/a3.jpg"/>
                                    </a>
                                    <div className="media-body">
                                        <textarea className="form-control" placeholder="Write comment..."></textarea>
                                    </div>
                                </div>

                            </div>

                        </div>
  )}
});


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

OrderCard = React.createClass({

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
        <div className="card-header">
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
        <div className="card-body">
          <IssueDetail issue={issue} handleFieldChange={this.handleFieldChange}/>
        </div>
      </div>
    )
  }

});