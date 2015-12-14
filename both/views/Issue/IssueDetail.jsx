

IssueFacilitySelector = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var issue, team, facility, area, teamFacilities, facilityAreas;
        issue = this.props.issue;
        if(issue) {
            team = issue.getTeam();
            if(team) {
                teamFacilities = team.getFacilities();
            }
            facility = issue.getFacility();
            if(facility) {
                area = issue.getArea();
                facilityAreas = facility.getAreas();
            }
        }
        return {
            teamFacilities:teamFacilities,
            selectedFacility:facility,
            facilityAreas:facilityAreas,
            selectedArea:area,
        }
    },

    handleChange(field,value) {
        this.props.issue[field] = value;
        this.props.issue.save();
    },

    render() {
        var facility = this.data.selectedFacility;
        var area = this.data.selectedArea;
        return (
            <div>
            <SuperSelect 
                items={this.data.teamFacilities} 
                itemView={ContactViewName}
                onChange={this.handleChange.bind(null,'_facility')}
            >
                <span style={{marginLeft:"4px"}} className="issue-summary-facility-col">
                    {facility?<span>{facility.getName()} -</span>:<span style={{color:"#999"}}>Select facility</span>}
                </span>
            </SuperSelect>
            {facility?
            <SuperSelect 
                items={this.data.facilityAreas} 
                itemView={ContactViewName}
                onChange={this.handleChange.bind(null,'area')}
            >
                <span style={{marginLeft:"4px"}} className="issue-summary-facility-col">
                    {area?<span>{area.name}</span>:<span style={{color:"#999"}}>Select area</span>}
                </span>
            </SuperSelect>
            :null}
            </div>
        )
    }
})



IssueDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var issue = this.props.item;
        if(!issue) {
            return {
                ready:false
            }
        }
        else {
            var facility, facilityContacts, facilityContact;
            facility = issue.getFacility();
            if(facility) {
                facilityContacts = facility.getContacts();
                facilityContact = facilityContacts?facilityContacts[0]:null;
            }

            return {
                ready:true,

                suppliers : Teams.find({type:"contractor"},{sort:{createdAt:-1}}).fetch(),

                issue:issue,
                facility:facility,

                creator:issue.getCreator(),
                supplier:issue.getSupplier(),
                assignee:issue.getAssignee(),
                timeframe:issue.getTimeframe(),
                facilityContact:facilityContact,

                notifications:issue.getNotifications(),
                services:Config.services,

                actionVerb:this.getActionVerb(issue)
            }
        }
    },

    saveItem() {
        this.item.save();
        //Meteor.call("Issue.save",this.issue);
    },

    updateField(field,event) {
        this.item[field] = event.target.value;
        this.saveItem();
    },

    updateObjectField(field,obj) {
        this.item[field] = obj;
        this.item.save();
    },

    updateService(service) {
        this.item.service = service;
        this.item.subservice = 0;
        this.item.save();
    },

    // this calculation to be done server side
    getActionVerb(issue) {
        if(issue.status=='Closed') {
            return;
        }
        var canCreate = (
            issue.name&&issue.name.length&&
            issue.description&&issue.description.length&&
            issue._facility&&issue._facility._id&&
            issue.area&&issue.area.name.length&&
            issue.service&&issue.service.name.length
        );
        var canIssue = (canCreate&&
            issue.subservice&&issue.subservice.name.length&&
            issue._supplier&&issue._supplier._id
        );
        var canClose = (canIssue&&
            issue._assignee&&issue._assignee._id
        );
        if(canClose) {
            return 'Close';
        }
        else if(canIssue) {
            return 'Issue';
        }
        else if(canCreate) {
            return 'Submit';
        }
    },

    showModal() {
        Modal.show({
            title:"All done? Great just need a few details to finalise the job.",
            onSubmit:this.reallyCloseOrder,
            content:<AutoForm item={this.props.item} schema={FM.schemas['Issue']} form={['closeDetails']} save={this.saveItem}/>
        })
    },

    progressOrder() {
        var issue = this.data.issue;
        var canCreate = (
            issue.name&&issue.name.length&&
            issue.description&&issue.description.length&&
            issue._facility&&issue._facility._id&&
            issue.area&&issue.area.name.length&&
            issue.service&&issue.service.name.length
        );
        var canIssue = (canCreate&&
            issue.subservice&&issue.subservice.name.length&&
            issue._supplier&&issue._supplier._id
        );
        var canClose = (canIssue&&
            issue._assignee&&issue._assignee._id
        );
        if(canClose) {
            this.showModal();
        }
        else if(canIssue) {
            var timeframe = this.data.timeframe;
            var createdMs = issue.createdAt.getTime();
            issue.dueDate = new Date(createdMs+timeframe);
            issue.status = "Issued";
            this.saveItem();
            if(this.props.closeCallback) {
                this.props.closeCallback()
            }            
        }
        else if(canCreate) {
            issue.status = "New";
            issue.isNewItem = false;
            this.saveItem();
            if(this.props.closeCallback) {
                this.props.closeCallback()
            }
        }
    },

    reallyCloseOrder() {
        this.item.status = "Closed";
        this.item.priority = "Closed";
        this.saveItem();
        if(this.props.closeCallback) {
            this.props.closeCallback()
        }
    },

    componentWillMount: function() {
        // perhaps we could debounce it in the model???
        this.saveItem = _.debounce(this.saveItem,500);
    },

    componentDidMount: function() {
        $(this.refs.description).elastic();
    },

    render() {
        var data = this.data;
        if(!data.ready) return <div />;

        var issue, facility, status, notifications;

        issue = this.item = data.issue;
        facility = data.facility;
        status = issue.status;
        notifications = data.notifications;

        var creator,supplier,assignee,facilityContact,contacts;

        creator = data.creator;
        supplier = data.supplier;
        assignee = data.assignee;
        facilityContact = data.facilityContact;
        contacts = [];
        ['creator','supplier','assignee','facilityContact'].map(function(item){
            if(data[item]) {
                contacts.push(data[item]);
            }
        })

        var createdAt = moment(issue.createdAt).calendar();
        var schema = FM.schemas['Issue'];

        //console.log(notifications);

        return (
<div className="issue-detail">

    <div className="row">
        <div className="col-lg-1 issue-icon-col">
            <div>
                <ContactAvatarSmall item={creator} />
            </div>
            <div>
                <span style={{top:"3px",position:"relative"}} className={"label dropdown-label label-"+issue.status}>{issue.status}</span>
            </div>
            <div>
                <SuperSelect 
                    items={['Scheduled','Standard','Urgent','Critical']} 
                    onChange={this.updateObjectField.bind(this,'priority')}
                >
                    <div style={{padding:"9px"}}>
                        <IssuePriority issue={issue} />
                    </div>
                </SuperSelect>
            </div>
        </div>
        <div className="col-lg-11" style={{marginLeft:"-25px",marginRight:"-25px",width:"95%"}}>
            <div className="issue-spec-area row">
                <div className="col-lg-6" style={{paddingLeft:"10px"}}>
                    <h2 style={{margin:0}}>
                        <input 
                            placeholder="Type issue title here"
                            className="inline-form-control" 
                            defaultValue={issue.name} 
                            onChange={this.updateField.bind(this,'name')}
                        />
                    </h2>
                    <div style={{marginTop:"7px",marginBottom:"7px"}}>
                        <IssueFacilitySelector issue={issue} />
                        <div style={{marginLeft:"4px"}} className="issue-summary-facility-col">
                            <b>Order #</b>
                            <span>{issue.code}</span>&nbsp;
                            <b>Cost $</b>
                            <span style={{display:"inline-block"}}><input 
                                className="inline-form-control" 
                                defaultValue={issue.costThreshold} 
                                onChange={this.updateField.bind(this,'costThreshold')}
                            /></span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2">
                    <div>
                        <SuperSelect 
                            itemView={ContactViewName}
                            items={this.data.services} 
                            classes="absolute"
                            onChange={this.updateService}
                        >
                            <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue.service?"Select":""} service type</span>
                        </SuperSelect>
                        {issue.service?
                            <span style={{position:"relative","top":"15px",fontSize:"11px",left:"1px"}}>{issue.service.name}</span>
                        :null}
                    </div>
                    {issue.service&&issue.service.subservices&&issue.service.subservices.length?
                        <div style={{position:"relative",top:"15px"}}>
                            <SuperSelect 
                                itemView={ContactViewName}
                                items={issue.service.subservices}
                                classes="absolute"
                                onChange={this.updateObjectField.bind(this,'subservice')}
                            >
                                <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue.subservice?"Select":""} subtype</span>
                            </SuperSelect>
                            {issue.subservice?
                                <span style={{position:"relative","top":"15px",fontSize:"11px",left:"1px"}}>{issue.subservice.name}</span>
                            :null}
                        </div>
                    :null}
                </div>
                <div className="col-lg-2">
                    {issue.status?
                    <div>

                        <SuperSelect 
                            itemView={ContactViewName}
                            items={this.data.suppliers} 
                            classes="absolute"
                            onChange={this.updateObjectField.bind(this,'_supplier')}
                        >
                            <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!supplier?"Select":""} Supplier</span>

                        </SuperSelect>

                        {!supplier?null:
                            <span style={{position:"relative","top":"15px",fontSize:"11px",left:"1px"}}>{supplier.name}</span>
                        }

                    </div>
                    :null}
                    {issue.status&&supplier?
                        <div style={{position:"relative",top:"15px"}}>
                            <SuperSelect 
                                itemView={ContactViewName}
                                items={supplier.getMembers()}
                                classes="absolute"
                                onChange={this.updateObjectField.bind(this,'_assignee')}
                            >
                                <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!issue._assignee?"":""} assignee</span>
                            </SuperSelect>
                            <span style={{position:"relative","top":"15px",fontSize:"11px",left:"1px"}}>{assignee?assignee.getName():'-'}</span>
                        </div>
                    :null}
                </div>
                <div className="col-lg-2">
                    <div style={{float:"right"}}>
                        {data.actionVerb?
                            <button onClick={this.progressOrder} style={{margin:0}} type="button" className={"btn btn-sm btn-"+((issue.name&&issue.description)?'Issued':'default')}>{data.actionVerb} order</button>
                        :null}
                    </div>
                </div>
            </div>

            <div className="issue-dynamic-area row">
                <div className="col-lg-12">
                    <span style={{paddingLeft:0}} className="btn btn-sm btn-flat issue-nav-btn">Description</span><br/>
                    <textarea 
                        ref="description"
                        placeholder="Type issue description here"
                        className="issue-description-textarea inline-form-control" 
                        defaultValue={issue.description} 
                        onChange={this.updateField.bind(this,'description')}
                    />
                </div>
                <div className="col-lg-12">
                    <IpsoTabso tabs={[
                    {
                        tab:<span><span>Images</span><span className="label label-notification">3</span></span>,
                        content:<AutoForm item={issue} schema={FM.schemas['Issue']} form={['attachments']} save={this.saveItem} />

                    },{
                        tab:"Documents",
                        content:<FileBrowser />
                    },{
                        tab:<span><span>Updates</span>{notifications.length?<span className="label label-notification">{notifications.length}</span>:null}</span>,
                        content:<div>
                            <IssueDiscussion items={notifications}/>
                            <Discussion 
                                value={issue.messages} 
                                onChange={this.updateObjectField.bind(this,'messages')}
                            />
                        </div>
                    },{
                        tab:<span>Contacts</span>,
                        content:<ContactList items={contacts} />
                    }
                    ]} />
                </div>
            </div>
        </div>
    </div>
</div>




)}
})