

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
        var issue = this.props.issue;
        var facility = this.data.selectedFacility;
        var area = this.data.selectedArea;
        return (
            <div className="row">
            <div className="col-lg-6">
                <SuperSelect 
                    readOnly={!issue.isEditable()}
                    items={this.data.teamFacilities} 
                    itemView={ContactViewName}
                    onChange={this.handleChange.bind(null,'facility')}
                >
                    <span className="issue-summary-facility-col">
                        {facility?<span>{facility.getName()} -</span>:<span style={{color:"#999"}}>Select facility</span>}
                    </span>
                </SuperSelect>
            </div>
            <div className="col-lg-6">
                {facility?
                <SuperSelect 
                    readOnly={!issue.isEditable()}
                    items={this.data.facilityAreas} 
                    itemView={ContactViewName}
                    onChange={this.handleChange.bind(null,'area')}
                >
                    <span className="issue-summary-facility-col">
                        {area?<span>{area.name}</span>:<span className="active-link-light">Select area</span>}
                    </span>
                </SuperSelect>
                :null}
            </div>
            </div>
        )
    }
})


IssueDynamicArea = React.createClass({

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

            return {
                ready:true,
                issue:issue,
                creator:issue.getCreator(),
                facilityContact:facilityContact,
                supplier:issue.getSupplier(),
                assignee:issue.getAssignee(),
                notifications:issue.getNotifications(),
            }
        }
    },

    componentDidMount: function() {
        $(this.refs.description).elastic();
    },

    updateItem: function(field,value) {
        this.props.item[field] = value;
        this.props.save();
    },

    render() {
        var issue = this.props.item;
        var notifications = this.data.notifications;
        var contacts = [];
        var data = this.data;
        ['creator','supplier','assignee','facilityContact'].map(function(item){
            if(data[item]) {
                contacts.push(data[item]);
            }
        });
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div style={{borderTop:"1px solid #ccc",marginTop:"10px",paddingBottom:"10px"}}></div>
                    <span className="btn btn-sm btn-flat issue-nav-btn">Description</span><br/>
                    <div className="issue-dynamic-area">
                        <AutoInput.Text 
                            elastic={true}
                            readOnly={!issue.isEditable()}
                            placeholder="Type issue description here"
                            value={issue.description} 
                            onChange={this.updateItem.bind(this,'description')}
                        />
                    </div>
                </div>
                <div className="col-lg-12" style={{marginTop:"10px"}}>
                    <IpsoTabso tabs={[
                        {
                            tab:<span><span>Files</span><span className="label label-notification">3</span></span>,
                            content:<AutoForm item={issue} schema={FM.schemas['Issue']} form={['attachments']} save={this.props.save} />
                        },{
                            tab:<span><span>Contacts</span></span>,
                            content:<ContactList items={contacts}/>
                        },{
                            tab:<span><span>Updates</span>{notifications.length?<span className="label label-notification">{notifications.length}</span>:null}</span>,
                            content:<div>
                                <IssueDiscussion items={notifications}/>
                                <Discussion 
                                    value={issue.messages} 
                                    onChange={this.updateItem.bind(this,'messages')}
                                />
                            </div>
                        }
                    ]} />
                </div>
            </div>
        )
    }
});

IssueDetail = React.createClass({

    saveItem() {
        Meteor.call('Issue.save',this.props.item);
    },

    componentWillMount: function() {
        this.saveItem = _.debounce(this.saveItem,500);
    },

    render() {
        var issue=this.props.item;
        return (
            <div className="issue-detail">
                <IssueSpecArea item={issue} save={this.saveItem} closeCallback={this.props.closeCallback}>
                    <IssueDynamicArea item={issue} save={this.saveItem} closeCallback={this.props.closeCallback}/>
                </IssueSpecArea>
            </div>
        )
    }
})