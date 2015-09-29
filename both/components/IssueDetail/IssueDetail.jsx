IssueDetail = React.createClass({

  handleNameChange(event) {
    this.props.handleFieldChange('name',event.target.value);
  },

  handleAddressChange(event) {
    this.props.handleFieldChange('address',event.target.value);
  },


    render() {
        var issue = this.props.issue;
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


    <div className="row">
        <div className="col-lg-9">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="m-b-md">
                                    <a href="#" className="btn btn-white btn-xs pull-right">Edit issue</a>
                                    <h2 style={{width:"70%"}}><input className="inline-form-control" value={issue.name} onChange={this.handleNameChange}/></h2>
                                    <h3><i className="fa fa-location-arrow"></i>&nbsp;&nbsp;{facility.name}</h3>
                                </div>
                                <dl className="dl-horizontal">
                                    <dt>Status:</dt> <dd><span className={"label label-"+statusClass}>{status}</span></dd>
                                </dl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-5">
                                <dl className="dl-horizontal">

                                    <dt>Created by:</dt> <dd>{contact.name}</dd>
                                    <dt>Contractor:</dt> <dd><a href="#" className="text-navy">{supplier.name}</a> </dd>
                                    <dt>Due:</dt><dd>2 days (10.07.2014 23:36:57)</dd>
                                </dl>
                            </div>
                            <div className="col-lg-7" id="cluster_info">
                                <dl className="dl-horizontal" >

                                    <dt>Requested:</dt><dd>16.08.2014 12:15:57</dd>
                                    <dt>Issued:</dt><dd>10.07.2014 23:36:57 </dd>
                                    <dt>Contacts:</dt>
                                    <dd className="project-people">
                                        <a href=""><img alt="image" className="img-circle" src="img/a3.jpg"/></a>
                                        <a href=""><img alt="image" className="img-circle" src="img/supplier-2.png"/></a>
                                        <a href=""><img alt="image" className="img-circle" src="img/a2.jpg"/></a>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <dl className="dl-horizontal">
                                    <dt>Completed:</dt>
                                    <dd>
                                        <div className="progress progress-striped active m-b-sm">
                                            <div style={{width:"60%"}} className="progress-bar"></div>
                                        </div>
                                        <small>Issue completed in <strong>60%</strong>. Remaining close the issue, sign a contract and invoice.</small>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        <div className="row m-t-sm">
                            <div className="col-lg-12">
                                <div className="panel blank-panel">
                                    <div className="panel-heading">
                                        <div className="panel-options">
                                            <ul className="nav nav-tabs">
                                                <li className="active"><a href="#tab-1" data-toggle="tab">Activity</a></li>
                                                <li className=""><a href="#tab-2" data-toggle="tab">Messages</a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="panel-body">

                                        <div className="tab-content">
                                            <div className="tab-pane active" id="tab-1">

                                                <table className="table table-striped">
                                                    <thead>
                                                    <tr>
                                                        <th>Status</th>
                                                        <th>Title</th>
                                                        <th>Start Time</th>
                                                        <th>End Time</th>
                                                        <th>Comments</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <span className="label label-danger"><i className="fa fa-check"></i> New</span>
                                                        </td>
                                                        <td>
                                                            Create issue
                                                        </td>
                                                        <td>
                                                            12.07.2014 10:10:1
                                                        </td>
                                                        <td>
                                                            14.07.2014 10:16:36
                                                        </td>
                                                        <td>
                                                            <p className="small">
                                                                Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable.
                                                            </p>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span className="label label-warning"><i className="fa fa-check"></i> Issued</span>
                                                        </td>
                                                        <td>
                                                            Various versions
                                                        </td>
                                                        <td>
                                                            12.07.2014 10:10:1
                                                        </td>
                                                        <td>
                                                            14.07.2014 10:16:36
                                                        </td>
                                                        <td>
                                                            <p className="small">
                                                                Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                                            </p>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span className="label label-success"><i className="fa fa-check"></i> Opened</span>
                                                        </td>
                                                        <td>
                                                            There are many variations
                                                        </td>
                                                        <td>
                                                            12.07.2014 10:10:1
                                                        </td>
                                                        <td>
                                                            14.07.2014 10:16:36
                                                        </td>
                                                        <td>
                                                            <p className="small">
                                                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which
                                                            </p>
                                                        </td>

                                                    </tr>

                                                    </tbody>
                                                </table>

                                            </div>
                                            <div className="tab-pane" id="tab-2">
                                                <div className="feed-activity-list">
                                                    <div className="feed-element">
                                                        <a href="#" className="pull-left">
                                                            <img alt="image" className="img-circle" src="img/a2.jpg"/>
                                                        </a>
                                                        <div className="media-body ">
                                                            <small className="pull-right">2h ago</small>
                                                            <strong>{contact.name}</strong> createed issue. <br/>
                                                            <small className="text-muted">Today 2:10 pm - 12.06.2014</small>
                                                            <div className="well">
                                                                {issue.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="feed-element">
                                                        <a href="#" className="pull-left">
                                                            <img alt="image" className="img-circle" src="img/a3.jpg"/>
                                                        </a>
                                                        <div className="media-body ">
                                                            <small className="pull-right">2h ago</small>
                                                            <strong>Janet Rosowski</strong> add 1 photo. <br/>
                                                            <small className="text-muted">2 days ago at 8:30am</small>
                                                        </div>
                                                    </div>
                                                    <div className="feed-element">
                                                        <a href="#" className="pull-left">
                                                            <img alt="image" className="img-circle" src="img/a4.jpg"/>
                                                        </a>
                                                        <div className="media-body ">
                                                            <small className="pull-right text-navy">5h ago</small>
                                                            <strong>{supplier.name}</strong> started looking at <strong>issue</strong>. <br/>
                                                            <small className="text-muted">Yesterday 1:21 pm - 11.06.2014</small>
                                                            <div className="actions">
                                                                <a className="btn btn-xs btn-white"><i className="fa fa-message"></i> Contact </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
        </div>
        <div className="col-lg-3">
            
                <h4>Description</h4>
                <p className="small">{issue.description}</p>
                <p className="small font-bold">
                    <span><i className="fa fa-circle text-warning"></i> High priority</span>
                </p>
                <h5>Files</h5>
                <ul className="list-unstyled issue-files">
                    <li><a href=""><i className="fa fa-file"></i> Issue_document.docx</a></li>
                    <li><a href=""><i className="fa fa-file-picture-o"></i> Logo_zender_company.jpg</a></li>
                    <li><a href=""><i className="fa fa-stack-exchange"></i> Email_from_Alex.mln</a></li>
                    <li><a href=""><i className="fa fa-file"></i> Contract_20_11_2014.docx</a></li>
                </ul>
                <div className="text-center m-t-md">
                    <a href="#" className="btn btn-xs btn-primary">Add files</a>
                    <a href="#" className="btn btn-xs btn-primary">Report contact</a>

                </div>
            
        </div>
    </div>
</div>
)}
})