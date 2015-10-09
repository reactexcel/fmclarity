

IssueDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('contacts');
        Meteor.subscribe('services');
        return {
            services : Services.find({},{sort:{name:1}}).fetch(),
            suppliers : Contacts.find({},{sort:{createdAt:-1}}).fetch()
        }
    },

    saveItem() {
        this.item.save();
        //Meteor.call("Issue.save",this.issue);
    },

    updateField(field) {
        var $this = this;
        // returns a function that modifies 'field'
        return function(event) {
            $this.item[field] = event.target.value;
            $this.saveItem();
        }
    },

    updateObjectField(field) {
        var $this = this;
        return function(obj) {
            $this.item[field] = obj;
            $this.item.save();
        }
    },

    updateService(service) {
        this.item.service = service;
        this.item.subservice = 0;
        this.item.save();
    },

    componentWillMount: function() {
        // perhaps we could debounce it in the model???
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
        status=='New'?'success':
        status=='Issued'?'warning':
        status=='Open'?'danger':
        status=='Closed'?'info':'';
        return (
<div>
    <div className="row">
        <div className="col-lg-9">
            <div className="row">
                <div className="col-lg-12">
                    <i className="fa fa-location-arrow"></i>
                    <input 
                        className="inline-form-control" 
                        style={{width:"90%",marginLeft:"3px",fontWeight:"bold"}} 
                        defaultValue={facility.name} 
                        onChange={this.updateField('address')}
                    />
                    <h2 style={{marginTop:"13px"}}>
                        <input 
                             placeholder="Type issue title here"
                            className="inline-form-control" 
                            defaultValue={issue.name} 
                            onChange={this.updateField('name')}
                        />
                    </h2>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-7" style={{paddingRight:0}}>
                            <span className={"label dropdown-label label-"+statusClass}>{issue.status}</span>
                            <SuperSelect 
                                items={['Normal','High','Critical']} 
                                onChange={this.updateObjectField('priority')}
                            >
                                <span><i className="fa fa-circle text-danger"></i> <span style={{fontWeight:"bold",fontSize:"10px"}}>{issue.priority||"Normal"} Priority</span></span>
                            </SuperSelect>
                            <textarea 
                                placeholder="Type issue description here"
                                className="issue-description-textarea inline-form-control" 
                                defaultValue={issue.description} 
                                onChange={this.updateField('description')}
                            />
                        </div>
                        <div className="col-lg-5">
                            <div style={{height:"32px"}}>
                                {issue.service?
                                    <span className="choose-service-btn label dropdown-label label-info">{issue.service.name} <i className="fa fa-caret-down"></i></span>
                                :
                                    <span className="choose-service-btn label dropdown-label">Choose Service Type <i className="fa fa-caret-down"></i></span>
                                }
                                {issue.subservice?
                                    <span className="choose-subservice-btn label dropdown-label label-info">{issue.subservice.name} <i className="fa fa-caret-down"></i></span>
                                :
                                    null
                                }
                                {issue.service&&(!issue.subservice)&&issue.service.subservices&&issue.service.subservices.length?
                                    <span className="choose-subservice-btn label dropdown-label">Choose Sub-service <i className="fa fa-caret-down"></i></span>
                                :
                                    null
                                }
                                {issue.supplier?
                                    <span className="choose-contract-btn label dropdown-label label-success">Change Contract <i className="fa fa-caret-down"></i></span>
                                :
                                    <span className="choose-contract-btn label dropdown-label">Choose Contract <i className="fa fa-caret-down"></i></span>
                                }
                            </div>

                            <SuperSelect 
                                itemView={ContactCard}
                                items={this.data.suppliers} 
                                classes="absolute"
                                toggleId=".choose-contract-btn"
                                initialState={{open:issue.isNewItem}}
                                onChange={this.updateObjectField('supplier')}
                            />

                            {supplier?
                                <div style={{width:"96%",height:"160px","position":"absolute"}}>
                                    <ContactSummary item={supplier} size="small"/>
                                </div>
                            :
                                null
                            }

                            {issue.service&&issue.service.subservices&&issue.service.subservices.length?
                            <SuperSelect 
                                itemView={ContactViewName}
                                items={issue.service.subservices}
                                classes="absolute"
                                toggleId=".choose-subservice-btn"
                                onChange={this.updateObjectField('subservice')}
                            />:null
                            }
                            <SuperSelect 
                                itemView={ContactViewName}
                                items={this.data.services} 
                                classes="absolute"
                                toggleId=".choose-service-btn"
                                onChange={this.updateService}
                            />
                        </div>
                        {issue.isNewItem?null:
                        <div className="col-lg-12">
                                        <ul className="" style={{opacity:0}}>
                                            <li className="active"><a href="#tab-1" data-toggle="tab">Activity</a></li>
                                            <li className=""><a href="#tab-2" data-toggle="tab">Messages</a></li>
                                        </ul>
                            <div className="panel blank-panel" style={{borderTop:"1px solid #ccc",borderRadius:"0px"}}>
                                <div className="panel-body" style={{padding:"5px"}}>
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="tab-1">
                                            <IssueTrackerTable />
                                        </div>
                                        <div className="tab-pane" id="tab-2" style={{paddingTop:"10px"}}>
                                            <IssueDiscussion issue={issue}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-3">
            <div className="file-panel">
                {issue.isNewItem
                ?
                    <div>
                        <div className="file-panel-image-browser">
                            <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={"img/default-placeholder.png"} />
                            <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={"img/file-placeholder.png"} />
                        </div>
                    </div>
                :
                    <div>
                        <div className="file-panel-image-browser">
                            <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={"img/issue-"+issue.thumb+".jpg"} />
                            <a href=""><img style={{"width":"40px","borderRadius":"1px","margin":"1px"}} alt="image" src="img/issue-1.jpg"/></a>
                            <a href=""><img style={{"width":"40px","borderRadius":"1px","margin":"1px"}} alt="image" src="img/issue-2.jpg"/></a>
                            <a href=""><img style={{"width":"40px","borderRadius":"1px","margin":"1px"}} alt="image" src="img/issue-3.jpg"/></a>
                            <a href=""><img style={{"width":"40px","borderRadius":"1px","margin":"1px"}} alt="image" src="img/issue-2.jpg"/></a>
                        </div>
                        <div className="file-panel-file-browser">
                            <FileBrowser />
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
</div>




)}
})