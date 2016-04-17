


IssueSpecArea = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe("contractors");
        var issue = this.props.item;
        if(!issue) {
            return {
                ready:false
            }
        }
        else {
            var selectedTeam, suppliers;
            selectedTeam = Session.getSelectedTeam();

            var facility, facilityContacts, facilityContact;
            facility = issue.getFacility();
            if(facility) {
                facilityContacts = facility.getMembers({role:'contact'});
                facilityContact = facilityContacts?facilityContacts[0]:null;
            }

            var supplier = issue.getSupplier();
            var owner = issue.getOwner();
            var assignee = issue.getAssignee();
            var user = Meteor.user();
            var team = issue.getTeam();

            return {
                ready:true,

                issue:issue,
                team:team,
                owner:owner,

                facility:facility,
                facilityContacts:facilityContacts,
                facilityContact:facilityContact,
                services:facility?facility.getAvailableServices():null,
                subservices:(facility&&issue.service)?facility.getAvailableServices(issue.service):null,

                selectedTeam:selectedTeam,
                suppliers:issue.getPotentialSuppliers(),
                allSuppliers:team?team.getSuppliers():null,

                supplier:supplier,
                assignee:assignee,

                notifications:issue.getNotifications(),
            }
        }
    },

    handleStatusChange(request){
        //console.log({'callback status change':request});
        if(!request) {
            //handleDestroy
        }
        else if(request.status=="Closing") {
            this.showModal();
        }
        else if(this.props.closeCallback) {
            this.props.closeCallback()
        }
    },

    save() {
        if(this.props.save){
            this.props.save();
        }
    },

    showModal() {
        var request = this.props.item;
        Modal.show({
            title:"All done? Great just need a few details to finalise the job.",
            onSubmit:function(){
                request.close();
            },
            //onCancel:this.regressOrder,
            content:
                <AutoForm 
                    item={this.props.item} 
                    schema={Issues.schema()} 
                    form={['closeDetails']}
                >
                    <h2>All done? Great! We just need a few details to finalise the job.</h2>
                </AutoForm>
        })
    },

    updateService(service) {
    	var request = this.props.item;
        request.service = service;
        if(request.service.data&&request.service.data.supplier) {
            request.supplier = request.service.data.supplier;
        }
        else {
            request.supplier = 0;
        }
        request.subservice = 0;
        this.save();
    },

    updateSubService(subservice) {
        var request = this.props.item;
        request.subservice = subservice;
        if(request.subservice.data&&request.subservice.data.supplier) {
            request.supplier = request.subservice.data.supplier;
        }
        this.save();
    },

    updateIdentifier(identifier) {
        var request = this.props.item;
        if(request.area) {
            request.area.identifier = identifier;
        }
        this.save();
    },

    updateLevel(level) {
        var request = this.props.item;
        request.level = level;
        request.area = 0;
        this.save();
    },

    updateItem: function(field,value) {
        this.props.item[field] = value;
        this.save();
    },

    componentWillMount: function() {
        this.updateItem = _.debounce(this.updateItem,500);
    },

    render() {
        var issue = this.props.item;
        var supplier = this.data.supplier;
        var owner = this.data.owner;
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
                        <div style={{float:"left",clear:"both",width:"45px",height:"45px",paddingLeft:"4px",paddingTop:"3px"}}>
                            <ContactAvatarSmall item={owner} />
                        </div>
                        <div style={{float:"left",clear:"both",width:"45px",height:"45px",paddingTop:"15px",textAlign:"center"}}>
                            <span style={{display:"inline-block"}} className={"label dropdown-label label-"+issue.status}>{issue.status}</span>
                        </div>
                        <div style={{float:"left",clear:"both",width:"45px",height:"45px",paddingTop:"9px",textAlign:"center"}}>
                            <SuperSelect 
                                items={['Scheduled','Standard','Urgent','Critical']} 
                                readOnly={!issue.canSetPriority()}
                                onChange={this.updateItem.bind(this,'priority')}
                            >
                                <IssuePriority issue={issue} />
                            </SuperSelect>
                        </div>
                    </div>
                    <div className="visible-sm col-sm-4">
                        <IssueActionButtons
                            width="50%"
                            item={issue}
                            onStatusChange={this.handleStatusChange}
                        />
                    </div>
                    <div className="col-xs-12 col-md-11">
                    	<div className="row">
	                    	<div className="col-md-10">
	                    		<div className="row">
	                    			<div className="col-md-12">
				                        <h2><AutoInput.Text
                                                readOnly={!issue.canSetName()}
                                                value={issue.name}
                                                placeholder="Type issue name here"
                                                onChange={this.updateItem.bind(this,'name')}
                                            />
                                        </h2>
				                    </div>
				                    <div className="col-md-3">
			                            <IssueFacilitySelector issue={issue} />
			                            <div style={{cursor:"default"}} className="issue-summary-facility-col">
                                        
			                                <b>Order #</b>
			                                <span>{issue.code}</span><br/>

			                                <b>Cost $</b>
			                                <span style={{display:"inline-block",width:"40px"}}>
                                                <AutoInput.Text
    			                                    readOnly={!issue.canSetCost()}
    			                                    value={issue.costThreshold} 
    			                                    onChange={this.updateItem.bind(this,'costThreshold')}
                                                />
                                            </span>
			                            </div>
				                    </div>{/*col*/}
                                    <div className="col-md-3">
                                        {this.data.facility?
                                        <div className="row">
                                            <div className="col-md-12">
                                                <SuperSelect 
                                                    readOnly={!issue.canSetLevel()}
                                                    itemView={ContactViewName}
                                                    items={this.data.facility.levels} 
                                                    onChange={this.updateLevel}
                                                >
                                                    <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue.level?"Select":""} area</span>
                                                </SuperSelect>
                                                {issue.level?
                                                    <div style={{clear:"both"}}>{issue.level.name}</div>
                                                :null}
                                            </div>
                                        </div>
                                        :null}
                                        {issue.level&&issue.level.type&&issue.level.type.children&&issue.level.type.children.length?
                                            <div className="row">
                                                <div className="col-md-12">
                                                <SuperSelect 
                                                    readOnly={!issue.canSetArea()}
                                                    itemView={ContactViewName}
                                                    items={issue.level.type.children} 
                                                    onChange={this.updateItem.bind(this,'area')}
                                                >
                                                    <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue.area?"Select":""} sub-area</span>
                                                </SuperSelect>
                                                {issue.area?
                                                    <div style={{clear:"both"}}>{issue.area.name}</div>
                                                :null}
                                                </div>
                                            </div>
                                        :null}
                                        {issue.area&&issue.area.identifiers&&issue.area.identifiers.length?
                                            <div className="row">
                                                <div className="col-md-12">
                                                <SuperSelect 
                                                    readOnly={!issue.canSetArea()}
                                                    itemView={ContactViewName}
                                                    items={issue.area.identifiers} 
                                                    onChange={this.updateIdentifier}
                                                >
                                                    <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue.area.identifier?"Select":""} identifier</span>
                                                </SuperSelect>
                                                {issue.area.identifier?
                                                    <div style={{clear:"both"}}>{issue.area.identifier.name}</div>
                                                :null}
                                                </div>
                                            </div>
                                        :null}
                                    </div>                                    
					                <div className="col-md-3">
                                        {this.data.facility?
					                    <div className="row">
					                    	<div className="col-md-12">
						                        <SuperSelect 
						                            readOnly={!issue.canSetService()}
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
                                        :null}
					                    {issue.service&&subservices&&subservices.length?
					                        <div className="row">
				                            	<div className="col-md-12">
					                            <SuperSelect 
					                                readOnly={!issue.canSetSubService()}
					                                itemView={ContactViewName}
					                                items={subservices} 
					                                onChange={this.updateSubService}
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
					                    {issue.status&&issue.service&&(supplier||issue.canSetSupplier())?
					                    <div className="row">
					                    	<div className="col-md-12">
					                        <SuperSelect 
					                            readOnly={!issue.canSetSupplier()}
					                            itemView={ContactViewName}
					                            items={suppliers} 
                                                moreItems={this.data.allSuppliers}
                                                clearOption={{name:"None"}}
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
					                    {issue.status&&supplier&&selectedTeam&&issue.canSetAssignee()?
					                        <div className="row">
					                        	<div className="col-lg-12">
					                            <SuperSelect 
                                                    readOnly={!issue.canSetAssignee()}
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
                                    item={issue}
                                    onStatusChange={this.handleStatusChange}
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
