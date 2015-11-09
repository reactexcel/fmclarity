

IssueDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('contacts');
        Meteor.subscribe('services');
        Meteor.subscribe('facilities');
        return {
            services : Services.find({},{sort:{name:1}}).fetch(),
            suppliers : Contacts.find({},{sort:{createdAt:-1}}).fetch(),
            facilities : Facilities.find({},{sort:{name:1}}).fetch()
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

    createOrder() {
        this.item.status = "New";
        this.item.isNewItem = false;
        this.saveItem();
    },

    sendOrder() {
        alert('Sending work order...');
        this.item.status = "Issued";
        this.saveItem();
    },

    closeOrder() {
        this.item.status = "Closing...";
        this.saveItem();
    },

    reallyCloseOrder() {
        this.item.status = "Closed";
        this.saveItem();
    },

    componentWillMount: function() {
        // perhaps we could debounce it in the model???
        this.saveItem = _.debounce(this.saveItem,500);
    },

    render() {
        var issue = this.item = this.props.item;
        var facility = issue._facility;
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
                <div className="col-lg-12" style={{paddingRight:0}}>
                    <SuperSelect 
                        items={this.data.facilities} 
                        itemView={ContactViewName}
                        onChange={this.updateObjectField('facility')}
                    >
                        <span style={{marginRight:"4px"}} className={"label dropdown-label label-"+statusClass}>{issue.status}</span>
                        {issue.priority!='Urgent'?null:
                          <i className="fa fa-exclamation-triangle text-danger" style={{fontSize:"20px",position:"relative",top: "4px"}}></i>
                        }
                        <i className="fa fa-location-arrow"></i>
                        <span style={{fontWeight:"bold",marginLeft:"4px"}} className="issue-summary-facility-col">{facility.name}</span>
                    </SuperSelect>

                    <h2 style={{marginTop:"13px",paddingBottom:"6px",borderBottom:"1px solid #ccc"}}>
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
                            <SuperSelect 
                                items={['Normal','Critical','Urgent']} 
                                onChange={this.updateObjectField('priority')}
                            >
                                <span><i className="fa fa-circle text-danger"></i> <span style={{fontWeight:"bold",fontSize:"10px"}}>{issue.priority||"Normal"} Priority</span></span>
                            </SuperSelect>
                            {issue.service&&issue.service.subservices&&issue.service.subservices.length?
                            <SuperSelect 
                                itemView={ContactViewName}
                                items={issue.service.subservices}
                                onChange={this.updateObjectField('subservice')}
                                classes="pull-right"
                            >
                                {issue.subservice?
                                    <span className="label dropdown-label label-info">{issue.subservice.name} <i className="fa fa-caret-down"></i></span>
                                :
                                    <span className="label dropdown-label">Choose Sub-service <i className="fa fa-caret-down"></i></span>
                                }
                            </SuperSelect>

                            :null
                            }
                            <SuperSelect 
                                itemView={ContactViewName}
                                items={this.data.services} 
                                onChange={this.updateService}
                                classes="pull-right"
                            >
                                {issue.service?
                                    <span className="label dropdown-label label-info">{issue.service.name} <i className="fa fa-caret-down"></i></span>
                                :
                                    <span className="label dropdown-label">Choose Service Type <i className="fa fa-caret-down"></i></span>
                                }
                            </SuperSelect>
                            <textarea 
                                placeholder="Type issue description here"
                                className="issue-description-textarea inline-form-control" 
                                defaultValue={issue.description} 
                                onChange={this.updateField('description')}
                            />
                        </div>
                        {issue.status?
                        <div className="col-lg-5">
                            <div style={{height:"32px"}}>
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
                                initialState={{open:issue.status=='New'}}
                                onChange={this.updateObjectField('supplier')}
                            />

                            {!supplier?null:
                                <div style={{width:"96%",height:"160px","position":"absolute"}}>
                                    <ContactSummary item={supplier} size="small"/>
                                </div>
                            }

                        </div>
                        :null}
                        <div className="col-lg-12" style={{paddingRight:0}}>
                            <a style={{margin:"5px",marginLeft:0}} className="pull-left btn btn-lg btn-default" href="#tab-1" data-toggle="tab"><i className="fa fa-tasks"></i></a>
                            <a style={{margin:"5px",marginLeft:0}} className="pull-left btn btn-lg btn-default" href="#tab-2" data-toggle="tab"><i className="fa fa-comment"></i></a>
                            {!issue.status?
                                <button onClick={this.createOrder} style={{margin:"5px",marginRight:0}} type="button" className={"pull-right btn btn-lg btn-"+((issue.name&&issue.description)?'success':'default')}>Create Request <i className="fa fa-paper-plane"></i></button>
                            :null}
                            {issue.status=='New'?
                                <button onClick={this.sendOrder} style={{margin:"5px",marginRight:0}} type="button" className={"pull-right btn btn-lg btn-"+(supplier?'warning':'default')}>Issue Order <i className="fa fa-paper-plane"></i></button>
                            :null}
                            {issue.status=='Issued'?
                                <button onClick={this.closeOrder} style={{margin:"5px",marginRight:0}} type="button" className={"pull-right btn btn-lg btn-"+(supplier?'danger':'default')}>Close Order <i className="fa fa-paper-plane"></i></button>
                            :null}
                            {issue.status=='Closed'?
                                <img style={{float:"right",margin:"15px 0 15px 0"}} src="img/5-stars-small.gif" />
                            :null}
                        </div>
                        {issue.isNewItem?null:
                        <div className="col-lg-12">
                            <div className="panel blank-panel" style={{borderTop:"1px solid #ccc",borderRadius:"0px"}}>
                                <div className="panel-body" style={{padding:"5px"}}>
                                    <div className="tab-content">
                                        <div className="active tab-pane" id="tab-1">
                                            <IssueTrackerTable issue={issue}/>
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
    {issue.status=='Closing...'?
        <img className="close-order-popup" src="img/close-order.PNG" onClick={this.reallyCloseOrder}/>
    :null}
</div>




)}
})