import React from "react";
import ReactDom from "react-dom";

import { ReactMeteorData } from 'meteor/react-meteor-data';
import { WorkflowButtons } from 'meteor/fmc:workflow-helper';
import { ContactDetails, ContactList } from 'meteor/fmc:doc-members';

import { FartoForm as AutoForm } from 'meteor/fmc:autoform';

IssueDetail = React.createClass( {
    mixins: [ ReactMeteorData ],
    getMeteorData() {
        var data = {};
        if ( this.props.item && this.props.item._id ) {
            data.request = Issues.findOne( this.props.item._id );
            if ( data.request ) {
                data.owner = data.request.getOwner();
                data.team = data.request.team;
                data.supplier = data.request.supplier;
                data.assignee = data.request.assignee;
                data.notifications = data.request.notifications;
                data.messageCount = data.request.messages ? data.request.messages.length : 0;
                data.attachmentCount = data.request.attachments.length ? data.request.attachments.length : 0;

                data.facility = data.request.facility;
                if ( data.facility ) {
                    data.facilityContact = data.facility.contact;
                }
            }
        }
        return data;
    },

    formatDate( date ) {
        return moment( date ).format( 'ddd Do MMM, h:mm a' );
    },

    render() {
        var request = this.data.request;

        if ( !request ) return <div/>

        var notifications = this.data.notifications;
        var thumb = request.service && request.service.name ? "img/services/" + request.service.name + ".jpg" : null;
        var contacts;
        if ( request.members ) {
            contacts = request.getMembers();
        } else {
            contacts = [];
            var data = this.data;
            [ 'owner', 'supplier', 'assignee', 'facilityContact' ].map( function( item ) {
                if ( data[ item ] ) {
                    contacts.push( data[ item ] );
                }
            } );
        }
        return (
            <div className="facility-card" style={{background:"#eee"}}>

                <div className="wo-detail">
                    <div className="row">
                        <div className="col-md-6">
                            <h2>{ this.data.team.name }</h2>
                            <FacilityDetails item = { this.data.facility }/>
                            <ContactDetails item = { this.data.owner }/>
                        </div>
                        <div className="col-md-6" style={{textAlign: 'right'}}>
                            <h2>Work Order No {request.code}</h2>

                            {request.service?
                            <b style={{display:"block",marginBottom:"7px"}}>{ request.getServiceString() }<br/></b>
                            :null}

                            <b>Created</b> <span>{ this.formatDate(request.createdDate) }<br/></span>

                            {request.issuedDate?
                            <span><b>Isssued</b> <span>{ this.formatDate(request.issuedDate) }</span><br/></span>
                            :null}

                            {request.dueDate
                            ?<span><b>Due</b> <span>{ this.formatDate(request.dueDate) }</span><br/></span>
                            :null}

                            {request.priority?
                            <span><b>Priority</b> <span>{ request.priority }</span><br/></span>
                            :null}

                            <span 
                                style={{display:"inline-block",fontSize:"16px",marginTop:"20px"}} 
                                className={"label label-"+request.status}>
                                { request.status }
                            </span>

                        </div>
                    </div>

                </div>
                
                <div style={{textAlign:"right",paddingRight:"20px"}}>
                    <WorkflowButtons item={ request }/>
                </div>

                <table>
                    <tbody>
                    <tr>
                        <th>Subject</th>
                        <td>{ request.name || <i>unnamed</i> }</td>
                    </tr>

                    {request.location?
                    <tr>
                        <th>Location</th>
                        <td>{request.getLocationString()}</td>
                    </tr>
                    :null}

                    {request.supplier?
                    <tr>
                        <th>Supplier</th>
                        <td>{request.supplier.name}</td>
                    </tr>
                    :null}

                    {request.description?                 
                    <tr>
                        <th>Description</th>
                        <td>{request.description}</td>
                    </tr>
                    :null}

                    </tbody>
                </table>

                <IpsoTabso tabs={[
                    {
                        tab:        <span id="discussion-tab"><span>Comments</span>{this.data.messageCount?<span>({this.data.messageCount})</span>:null}</span>,
                        content:    <Inbox for={request} truncate={true}/>
                    },{
                        tab:        <span id="documents-tab"><span>Files</span>{this.data.attachmentCount?<span>({this.data.attachmentCount})</span>:null}</span>,
                        content:    <AutoForm item={request} form={['documents']} save={()=>request.save}/>
                    },{
                        tab:        <span id="contacts-tab"><span>Contacts</span></span>,
                        content:    <ContactList group={request} readOnly={true}/>
                    }
                ]} />
            </div>
        )
    }
} )
