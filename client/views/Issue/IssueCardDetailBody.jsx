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
            selectedTeam = Session.getSelectedTeam();

            var facility, facilityContacts, facilityContact;
            facility = issue.getFacility();
            if(facility) {
                facilityContacts = facility.getMembers({role:'contact'});
                facilityContact = facilityContacts?facilityContacts[0]:null;
            }

            return {
                ready:true,
                issue:issue,
                owner:issue.getOwner(),
                facilityContact:facilityContact,
                supplier:issue.getSupplier(),
                assignee:issue.getAssignee(),
                notifications:issue.getNotifications(),
                messageCount:issue.getMessageCount(),
                attachmentCount:issue.getAttachmentCount()
            }
        }
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
        ['owner','supplier','assignee','facilityContact'].map(function(item){
            if(data[item]) {
                contacts.push(data[item]);
            }
        });
        return (
            <div className="row">
            {/*
                <div className="col-lg-12">
                    <div style={{borderTop:"1px solid #ccc",marginTop:"10px",paddingBottom:"10px"}}></div>
                    <span className="btn btn-sm btn-flat issue-nav-btn">Description</span><br/>
                    <div className="issue-dynamic-area">
                        <AutoInput.Text 
                            elastic={true}
                            readOnly={!issue.canSetDescription()}
                            placeholder="Type issue description here"
                            value={issue.description} 
                            onChange={this.updateItem.bind(this,'description')}
                        />
                    </div>
                </div>
            */}
                <div className="col-lg-12" style={{marginTop:"10px"}}>
                    <IpsoTabso tabs={[
                        {
                            tab:<span><span>Comments</span>{this.data.messageCount?<span>({this.data.messageCount})</span>:null}</span>,
                            content:<div style={{padding:"15px"}}>
                                <Inbox for={issue} />
                            </div>
                        },{
                            tab:<span><span>Files</span>{this.data.attachmentCount?<span>({this.data.attachmentCount})</span>:null}</span>,
                            content:<div style={{padding:"15px"}}>
                                <AutoForm item={issue} schema={Issues.schema()} form={['attachments']} save={this.props.save} />
                            </div>
                        },{
                            tab:<span><span>Contacts</span></span>,
                            content:<div style={{padding:"15px"}}>
                                <ContactList items={contacts}/>
                            </div>
                        }
                    ]} />
                </div>
            </div>
        )
    }
});
