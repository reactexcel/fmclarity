import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import {WorkflowButtons} from 'meteor/fmc:workflow-helper';

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
                team:request.getTeam(),
                facility:request.getFacility(),
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

    formatDate(date) {
        return moment(date).format('ddd Do MMM, h:mm a');
    },

    render() {
        var request = this.props.item;
        var notifications = this.data.notifications;
        var service = request?request.service:{};
        var thumb = service&&service.name?"img/services/"+service.name+".jpg":null;
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
            <div className="facility-card" style={{background:"#eee"}}>

                <div className="wo-detail">
                    <div className="row">
                        <div className="col-md-6">
                            <h2>{this.data.team.name}</h2>
                            <FacilityDetails item={this.data.facility}/>
                            <ContactDetails item={this.data.owner}/>
                        </div>
                        <div className="col-md-6" style={{textAlign:"right"}}>
                            <h2>Work Order No {request.code}</h2>
                            {request.service?<b style={{display:"block",marginBottom:"7px"}}>{request.getServiceString()}<br/></b>:null}
                            <b>Created</b> <span>{this.formatDate(request.createdDate)}<br/></span>
                            {request.issuedDate?<span><b>Isssued</b> <span>{this.formatDate(request.issuedDate)}</span><br/></span>:null}
                            {request.dueDate?<span><b>Due</b> <span>{this.formatDate(request.dueDate)}</span><br/></span>:null}
                            {request.priority?<span><b>Priority</b> <span>{request.priority}</span><br/></span>:null}
                            <b>Status</b><br/>
                            <span style={{display:"inline-block",fontSize:"16px",marginTop:"20px"}} className={"label label-"+request.status}>{request.status}</span>

                        </div>
                    </div>

                </div>
                
                <div style={{textAlign:"right"}}>
                    <WorkflowButtons item={request}/>
                </div>

                <table>
                    <tbody>
                    <tr>
                        <th>Subject</th>
                        <td>{request.name||<i>unnamed</i>}</td>
                    </tr>
                    {request.location?<tr>
                        <th>Location</th>
                        <td>{request.getLocationString()}</td>
                    </tr>:null}
                    {request.supplier?<tr>
                        <th>Supplier</th>
                        <td>{request.supplier.name}</td>
                    </tr>:null}
                    {request.description?                 
                    <tr>
                        <th>Description</th>
                        <td>{request.description}</td>
                    </tr>:null}
                    </tbody>
                </table>

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
