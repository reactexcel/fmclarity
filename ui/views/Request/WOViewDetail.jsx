import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';
/*
IssueDetail = React.createClass({

    saveItem() {
        Meteor.call('Issues.save',this.props.item);
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
*/
IssueDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var request = this.props.item;
        if(!request) {
            return {
                ready:false
            }
        }
        else {
            var selectedTeam, suppliers;
            selectedTeam = Session.getSelectedTeam();

            var facility, facilityContacts, facilityContact;
            facility = request.getFacility();
            if(facility) {
                facilityContacts = facility.getPrimaryContact();
            }

            return {
                ready:true,
                request:request,
                owner:request.getOwner(),
                facilityContact:facilityContact,
                supplier:request.getSupplier(),
                assignee:request.getAssignee(),
                notifications:request.getNotifications(),
                messageCount:request.getMessageCount(),
                attachmentCount:request.getAttachmentCount()
            }
        }
    },

    saveItem() {
        Meteor.call('Issues.save',this.props.item);
    },

    componentWillMount: function() {
        this.saveItem = _.debounce(this.saveItem,500);
    },    

    render() {
        var request = this.props.item;
        var notifications = this.data.notifications;
        var service = request?request.service:{};
        var thumb = service.name?"img/services/"+service.name+".jpg":null;
        var contacts;
        if(request.members) {
            contacts = request.getMembers();
        }
        else {
            contacts = [];
            var data = this.data;
            ['owner','supplier','assignee','facilityContact'].map(function(item){
                if(data[item]) {
                    contacts.push(data[item]);
                }
            });
        }
        return (
            <div className="facility-card">

                <div className="contact-thumbnail">
                    {thumb?
                    <div className="cover-image" style={{backgroundImage:"url('"+thumb+"')"}}></div>
                    :null}

                    <div className="title-overlay">
                        <div className="row">
                            <div className="col-md-12">
                                <IssueSpecArea item={request} save={this.saveItem} closeCallback={this.props.closeCallback}/>
                            </div>
                        </div>
                    </div>

                </div>


                <IpsoTabso tabs={[
                    {
                        tab:        <span id="discussion-tab"><span>Comments</span>{this.data.messageCount?<span>({this.data.messageCount})</span>:null}</span>,
                        content:    <Inbox for={request} truncate={true}/>
                    },{
                        tab:        <span id="documents-tab"><span>Files</span>{this.data.attachmentCount?<span>({this.data.attachmentCount})</span>:null}</span>,
                        content:    <div style={{padding:"15px"}}><AutoForm item={request} form={['attachments']} save={()=>request.save}/></div>
                    },{
                        tab:        <span id="contacts-tab"><span>Contacts</span></span>,
                        content:    <ContactList group={request} readOnly={true}/>
                    }
                ]} />                
            </div>
        )}
})
