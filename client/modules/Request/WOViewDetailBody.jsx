import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';


IssueDynamicArea = React.createClass(
{

    mixins: [ ReactMeteorData ],

    getMeteorData()
    {
        var request = this.props.item;
        if ( !request )
        {
            return {
                ready: false
            }
        }
        else
        {
            var selectedTeam, suppliers;
            selectedTeam = Session.getSelectedTeam();

            var facility, facilityContacts, facilityContact;
            facility = request.getFacility();
            if ( facility )
            {
                facilityContacts = facility.getPrimaryContact();
            }

            return {
                ready: true,
                request: request,
                owner: request.getOwner(),
                facilityContact: facilityContact,
                supplier: request.getSupplier(),
                assignee: request.getAssignee(),
                notifications: request.getNotifications(),
                messageCount: request.getMessageCount(),
                attachmentCount: request.getAttachmentCount()
            }
        }
    },

    updateItem: function( field, value )
    {
        this.props.item[ field ] = value;
        this.props.save();
    },

    render()
    {
        var request = this.props.item;
        var notifications = this.data.notifications;
        var contacts;
        if ( request.members )
        {
            contacts = request.getMembers();
        }
        else
        {
            contacts = [];
            var data = this.data;
            [ 'owner', 'supplier', 'assignee', 'facilityContact' ].map( function( item )
            {
                if ( data[ item ] )
                {
                    contacts.push( data[ item ] );
                }
            } );
        }
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
            </div>
        )
    }
} );
