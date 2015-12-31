IssueActionButtons = React.createClass({
    render() {
        var issue = this.props.issue;
        var progressVerb = this.props.progressVerb;
        var regressVerb = this.props.regressVerb;
        var progressAction = this.props.progressAction;
        var regressAction = this.props.regressAction;
        var width = this.props.width||"100%";
        return (
            <div>
                {progressVerb?
                    <button 
                        onClick={progressAction} 
                        style={{margin:0,width:width,maxWidth:"400px"}} 
                        type="button" 
                        className={"btn btn-sm btn-"+(issue.canCreate()?'Issued':'disabled')}>
                        {progressVerb}
                    </button>
                :null}
                {regressVerb?
                    <button 
                        onClick={regressAction} 
                        style={{width:width,maxWidth:"400px"}} 
                        type="button" 
                        className="btn btn-sm btn-Issued">
                        {regressVerb}
                    </button>
                :null}
            </div>
        )
    }
});


IssueSpecArea = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        var issue = this.props.item;
        if(!issue) {
            return {
                ready:false
            }
        }
        else {
            var selectedTeam, suppliers;
            selectedTeam = FM.getSelectedTeam();

            var facility, facilityContacts, facilityContact;
            facility = issue.getFacility();
            if(facility) {
                facilityContacts = facility.getContacts();
                facilityContact = facilityContacts?facilityContacts[0]:null;
            }

            var actionVerb = this.getActionVerb(issue);

            return {
                ready:true,

                issue:issue,
                creator:issue.getCreator(),
                timeframe:issue.getTimeframe(),

                facility:facility,
                facilityContacts:facilityContacts,
                facilityContact:facilityContact,
                services:facility?facility.getAvailableServices():null,
                subservices:(facility&&issue.service)?facility.getAvailableServices(issue.service):null,

                selectedTeam:selectedTeam,
                suppliers:issue.getPotentialSuppliers(),
                supplier:issue.getSupplier(),

                assignee:issue.getAssignee(),

                notifications:issue.getNotifications(),
                actionVerb:actionVerb,
                regressVerb:(issue.status=="New"?"Cancel":issue.status=="Issued"?"Reverse":null)
            }
        }
    },

    progressOrder() {
        var issue = this.data.issue;
        issue.isNewItem = false;
        if(issue.canClose()) {
            this.showModal();
        }
        else if(issue.canIssue()) {
            var timeframe = this.data.timeframe;
            var createdMs = issue.createdAt.getTime();
            issue.dueDate = new Date(createdMs+timeframe);
            issue.status = "Issued";
            this.save();
            if(this.props.closeCallback) {
                this.props.closeCallback()
            }            
        }
        else if(issue.canCreate()) {
            issue.status = "New";
            this.save();
            if(this.props.closeCallback) {
                this.props.closeCallback()
            }
        }
    },

    save() {
    	if(this.props.save){
    		this.props.save();
    	}
    },

    regressOrder() {
        var issue = this.data.issue;
        var save = this.props.save;
        if(issue.status=="Issued") {
            issue.status = "New";
            this.save();
        }
        else if(issue.status=="New") {
            issue.destroy();
            if(this.props.closeCallback) {
                this.props.closeCallback()
            }
        }
    },

    reallyCloseOrder() {
        var issue = this.data.issue;
        issue.status = "Closed";
        issue.priority = "Closed";
        this.save();
        if(this.props.closeCallback) {
            this.props.closeCallback()
        }
    },

    showModal() {
        Modal.show({
            title:"All done? Great just need a few details to finalise the job.",
            onSubmit:this.reallyCloseOrder,
            content:<AutoForm item={this.props.item} schema={FM.schemas['Issue']} form={['closeDetails']}/>
        })
    },

    updateService(service) {
    	var issue = this.props.item;
        issue.service = service;
        issue.subservice = 0;
        this.save();
    },

    // this calculation to be done server side
    getActionVerb(issue) {
        if(issue.status=='Closed') {
            return;
        }
        if(issue.canClose()) {
            return 'Close';
        }
        else if(issue.canIssue()) {
            return 'Issue';
        }
        else {
            return 'Submit';
        }
    },

    updateItem: function(field,value) {
        this.props.item[field] = value;
        this.save();
    },

    render() {
        var issue = this.props.item;
        var supplier = this.data.supplier;
        var creator = this.data.creator;
        var services = this.data.services;
        var suppliers = this.data.suppliers;
        var subservices = this.data.subservices;
        var selectedTeam = this.data.selectedTeam;
        var actionVerb = this.data.actionVerb;
        var regressVerb = this.data.regressVerb;
        var assignee = this.data.assignee;
        return (
            <div className="issue-spec-area">

                <div className="row">
                    <div className="col-xs-12 col-sm-8 col-md-1">
                        <div style={{float:"left",width:"45px",height:"45px",paddingLeft:"4px",paddingTop:"3px"}}>
                            <ContactAvatarSmall item={creator} />
                        </div>
                        <div style={{float:"left",width:"45px",height:"45px",paddingTop:"15px",textAlign:"center"}}>
                            <span style={{display:"inline-block"}} className={"label dropdown-label label-"+issue.status}>{issue.status}</span>
                        </div>
                        <div style={{float:"left",width:"45px",height:"45px",paddingTop:"9px",textAlign:"center"}}>
                            <SuperSelect 
                                items={['Scheduled','Standard','Urgent','Critical']} 
                                readOnly={!issue.isEditable()}
                                onChange={this.updateItem.bind(this,'priority')}
                            >
                                <IssuePriority issue={issue} />
                            </SuperSelect>
                        </div>
                    </div>
                    <div className="visible-sm col-sm-4">
                        <IssueActionButtons
                            width="50%"
                            issue={issue}
                            progressVerb={actionVerb}
                            progressAction={this.progressOrder}
                            regressVerb={regressVerb}
                            regressAction={this.regressOrder}
                        />
                    </div>
                    <div className="col-xs-12 col-md-11">
                    	<div className="row">
	                    	<div className="col-md-10">
	                    		<div className="row">
	                    			<div className="col-md-12">
				                        <h2><AutoInput.Text readOnly={!issue.isEditable()} value={issue.name} onChange={this.updateItem.bind(this,'name')}/></h2>
				                    </div>
				                    <div className="col-md-6">
			                            <IssueFacilitySelector issue={issue} />
			                            <div style={{cursor:"default"}} className="issue-summary-facility-col">
			                                <b>Order #</b>
			                                <span>{issue.code}</span>&nbsp;
			                                <b>Cost $</b>
			                                <span style={{display:"inline-block"}}><input 
			                                    readOnly={!issue.isEditable()}
			                                    className="inline-form-control" 
			                                    defaultValue={issue.costThreshold} 
			                                    onChange={this.updateItem.bind(this,'costThreshold')}
			                                /></span>
			                            </div>
				                    </div>{/*col*/}
					                <div className="col-md-3">
					                    <div className="row">
					                    	<div className="col-md-12">
						                        <SuperSelect 
						                            readOnly={!issue.isEditable()}
						                            itemView={ContactViewName}
						                            items={services} 
						                            onChange={this.updateService}
						                        >
						                            <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue.service?"Select":""} service type</span>
						                        </SuperSelect>
						                        {issue.service?
						                            <div style={{clear:"both"}}>{issue.service.name}</div>
						                        :null}
						                    </div>
						                </div>
					                    {issue.service&&subservices&&subservices.length?
					                        <div className="row">
				                            	<div className="col-md-12">
					                            <SuperSelect 
					                                readOnly={!issue.isEditable()}
					                                itemView={ContactViewName}
					                                items={subservices} 
					                                onChange={this.updateItem.bind(this,'subservice')}
					                            >
					                                <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue.subservice?"Select":""} subtype</span>
					                            </SuperSelect>
					                            {issue.subservice?
					                                <div style={{clear:"both"}}>{issue.subservice.name}</div>
					                            :null}
					                            </div>
					                        </div>
					                    :null}
					                </div>
					                <div className="col-md-3">
					                    {issue.status?
					                    <div className="row">
					                    	<div className="col-md-12">
					                        <SuperSelect 
					                            readOnly={!issue.isEditable()}
					                            itemView={ContactViewName}
					                            items={suppliers} 
					                            onChange={this.updateItem.bind(this,'supplier')}
					                        >
					                            <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!supplier?"Select":""} Supplier</span>

					                        </SuperSelect>

					                        {!supplier?null:
					                            <div style={{clear:"both"}}>{supplier.name}</div>
					                        }
					                        </div>
					                    </div>
					                    :null}
					                    {issue.status&&supplier&&supplier._id==selectedTeam._id?
					                        <div className="row">
					                        	<div className="col-lg-12">
					                            <SuperSelect 
					                                itemView={ContactViewName}
					                                items={supplier.getMembers()}
					                                onChange={this.updateItem.bind(this,'assignee')}
					                            >
					                                <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue.assignee?"":""} assignee</span>
					                            </SuperSelect>
					                            <div style={{clear:"both"}}>{assignee?assignee.getName():'-'}</div>
					                            </div>
					                        </div>
					                    :null}
					                </div>
				                </div>
		                    </div>{/*col*/}
		                    <div className="col-xs-12 hidden-sm col-md-2">
                                <IssueActionButtons
                                    issue={issue}
                                    progressVerb={actionVerb}
                                    progressAction={this.progressOrder}
                                    regressVerb={regressVerb}
                                    regressAction={this.regressOrder}
                                />
		                   	</div>
		                   	<div className="col-xs-12">
		                   		{this.props.children}
		                   	</div>
		                </div>{/*row*/}
		            </div>
	            </div>
            </div>
        )
    }
});
