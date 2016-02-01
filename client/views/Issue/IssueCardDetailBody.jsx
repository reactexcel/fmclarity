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
                            tab:<span><span>Files</span>{this.data.attachmentCount?<span>({this.data.attachmentCount})</span>:null}</span>,
                            content:<AutoForm item={issue} schema={FM.schemas['Issue']} form={['attachments']} save={this.props.save} />
                        },{
                            tab:<span><span>Contacts</span></span>,
                            content:<ContactList items={contacts}/>
                        },{
                            tab:<span><span>Updates</span>{this.data.messageCount?<span>({this.data.messageCount})</span>:null}</span>,
                            content:<div>
                                <Inbox for={issue} />
                            </div>
                        }
                    ]} />
                </div>
            </div>
        )
    }
});
