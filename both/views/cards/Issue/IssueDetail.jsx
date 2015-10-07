

IssueDetail = React.createClass({

    saveItem() {
        this.item.save();
        //Meteor.call("Issue.save",this.issue);
    },

    deleteItem() {
        var dom = $(React.findDOMNode(this));
        var parent = dom.closest('.grid-item');
        var $scope = this;
        parent.toggleClass('diminished gigante',250,function(){
            $scope.item.destroy();
            //Meteor.call("Issue.destroy",$scope.facility);
        });
    },    

    updateField(field) {
        var $this = this;
        return function(event) {
            $this.item[field] = event.target.value;
            $this.saveItem();
        }
    },

    componentWillMount: function() {
        this.saveItem = _.debounce(this.saveItem,500);
    },

    render() {
        var issue = this.item = this.props.item;
        var facility = issue.facility;
        var createdAt = moment(issue.createdAt).calendar();
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
        <div className="col-lg-12">
            <div className="m-b-md">
                <button 
                    onClick={this.deleteItem} 
                    className="delete-button pull-right"
                >
                    <i className="fa fa-trash-o"></i>
                </button>
                <h2 style={{width:"70%"}}><input className="inline-form-control" defaultValue={issue.name} onChange={this.updateField('name')}/></h2>
                <h3><i className="fa fa-location-arrow"></i>&nbsp;&nbsp;{facility.name}</h3>
            </div>
        </div>
    </div>
    <div className="row">
        <div className="col-lg-9">
            <div className="row">
                <div className="col-lg-5">
                    <dl className="dl-horizontal">
                        <dt>Status:</dt> <dd><span className={"label label-"+statusClass}>{status}</span></dd>
                        <dt>Created by:</dt> <dd>{contact.name}</dd>
                        <dt>Contractor:</dt> <dd><a href="#" className="text-navy">{supplier.name}</a> </dd>
                    </dl>
                </div>
                <div className="col-lg-7" id="cluster_info">
                    <dl className="dl-horizontal" >
                        <dt>Due:</dt><dd>2 days (10.07.2014 23:36:57)</dd>
                        <dt>Requested:</dt><dd>{createdAt}</dd>
                        <dt>Issued:</dt><dd>10.07.2014 23:36:57 </dd>
                    </dl>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <dl className="dl-horizontal">
                        <dt>Description:</dt>
                        <dd>
                            <textarea 
                                className="inline-form-control" 
                                style={{width:"90%",minHeight:"50px"}} 
                                defaultValue={issue.description} 
                                onChange={this.updateField('description')}
                            />
                        </dd>
                    </dl>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <dl className="dl-horizontal">
                        <dt>Contacts:</dt>
                        <dd className="project-people">
                            <a href=""><ContactCard contact={contact} view="avatar"/></a>
                            <a href=""><img alt="image" className="img-circle" src="img/supplier-2.png"/></a>
                            <a href=""><img alt="image" className="img-circle" src="img/a2.jpg"/></a>
                        </dd>
                    </dl>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <dl className="dl-horizontal">
                        <dt>Images:</dt>
                        <dd className="issue-images">
                            <a href=""><img style={{"width":"40px","borderRadius":"2px","margin":"1px"}} alt="image" src="img/issue-1.jpg"/>
                            </a>
                            <a href=""><img style={{"width":"40px","borderRadius":"2px","margin":"1px"}} alt="image" src="img/issue-2.jpg"/>
                            </a>
                            <a href=""><img style={{"width":"40px","borderRadius":"2px","margin":"1px"}} alt="image" src="img/issue-3.jpg"/>
                            </a>
                            <a href="#" className="btn btn-xs btn-primary">+</a>
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
                                    <IssueTrackerTable />
                                </div>
                                <div className="tab-pane" id="tab-2">
                                    <IssueDiscussion issue={issue}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-3">            
            <b>Support Files:</b>
            <ul className="list-unstyled issue-files">
                <li><a href=""><i className="fa fa-file"></i> Issue_document.docx</a></li>
                <li><a href=""><i className="fa fa-file-picture-o"></i> Logo_zender_company.jpg</a></li>
                <li><a href=""><i className="fa fa-stack-exchange"></i> Email_from_Alex.mln</a></li>
                <li><a href=""><i className="fa fa-file"></i> Contract_20_11_2014.docx</a></li>                
            </ul>
            <div className="text-center m-t-md">
                <a href="#" className="btn btn-xs btn-primary">+</a>&nbsp;
            </div>
        </div>
    </div>
</div>
)}
})