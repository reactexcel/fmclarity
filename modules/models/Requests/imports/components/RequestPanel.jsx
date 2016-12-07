import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Inbox } from '/modules/models/Messages';
import { AutoForm } from '/modules/core/AutoForm';
import { FacilityDetails } from '/modules/models/Facilities';
import { WorkflowButtons } from '/modules/core/WorkflowHelper';
import { ContactDetails, ContactList } from '/modules/mixins/Members';
import { Tabs } from '/modules/ui/Tabs';
import { Menu } from '/modules/ui/MaterialNavigation';
// wouldn't it be nice to go import { Tabs, Menu } from '/modules/ui/MaterialNavigation'

import { Requests, RequestActions } from '/modules/models/Requests';
import { TeamActions } from '/modules/models/Teams';

import moment from 'moment';

export default RequestPanel = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        let request = null,
            nextRequest = null,
            previousRequest = null,
            nextDate = null,
            previousDate = null,
            owner = null;
        if ( this.props.item && this.props.item._id ) {
            request = Requests.findOne( this.props.item._id );
            
            if( request ) {
                Meteor.subscribe( 'Inbox: Messages', request._id );
                owner = request.getOwner();
                if( request.type == 'Preventative' ) {
                    nextDate = request.getNextDate();
                    previousDate = request.getPreviousDate();
                    nextRequest = request.findCloneAt( nextDate );
                    previousRequest = request.findCloneAt( previousDate );
                }
            }
        }
        return { request, nextDate, previousDate, nextRequest, previousRequest, owner }
    },

    render() {
        return <RequestPanelInner { ...this.data }/>
    }
} );


const RequestPanelInner = ( { request, nextRequest, previousRequest, owner } ) => {

    function formatDate( date ) {
        return moment( date ).format( 'ddd Do MMM, h:mm a' );
    }

    if ( !request ) {
        return <div/>
    }
    let teamType = Session.get('selectedTeam').type,
        title = "",
        nextDateString = null,
        previousDateString = null;

    if( request.type == 'Preventative' ) {
        title = 'PPM';

        if( nextDate ) {
            nextDateString = moment( nextDate ).format('ddd Do MMM');
        }
        if( previousDate ) {
            previousDateString = moment( previousDate ).format('ddd Do MMM');
        }

    }
    else {
        if( request.type == 'Booking' ) {
            title = 'Room Booking';
        }
        else if( teamType == 'fm' ) {
            title = "Work Order";
        }
        else {
            title = "Job";
        }
        if( request.code ) {
            title += ` # ${request.code}`
        }
        else {
            title = "New "+title;
        }
    }

    return (
        <div className="request-panel" style={{background:"#eee"}}>

            <div className="wo-detail">
                <div className="row">
                    <div className="col-md-6">
                        <h2>{ request.team.name }</h2>
                        <FacilityDetails item = { request.facility }/>
                        <ContactDetails item = { owner }/>
                    </div>
                    <div className="col-md-6" style={{textAlign: 'right'}}>

                            <h2>{title}</h2>

                            { request.service && request.type!= 'Booking' ?
                            <b style = { { display:"block",marginBottom:"7px" } } >{request.getServiceString()}<br/></b>
                            : null }

                            {/*<b>Created</b> <span>{formatDate(request.createdAt)}<br/></span>*/}

                            { request.issuedAt ?
                            <span><b>Issued</b> <span>{formatDate(request.issuedAt)}</span><br/></span>
                            : null }

                            { request.dueDate ?
                            <span><b>Due</b> <span>{formatDate(request.dueDate)}</span><br/></span>
                            : null }

                            { request.priority ?
                            <span><b>Priority</b> <span>{request.priority}</span><br/></span>
                            : null }

                            <span
                                style       = { { display:"inline-block",fontSize:"16px",marginTop:"20px"}}
                                className   = { "label label-"+request.status}
                            >

                                {request.status}

                            </span>

                    </div>
                </div>

            </div>

            <div style={{textAlign:"right",paddingRight:"20px"}}>
                <WorkflowButtons actions = { RequestActions } item = { request }/>
            </div>

            <table>
                <tbody>
                <tr>
                    <th>Subject</th>
                    <td>{ request.name || <i>unnamed</i> }</td>
                </tr>

                { request.getLocationString() ?
                <tr>
                    <th>Location</th>
                    <td>{request.getLocationString()}</td>
                </tr>
                : null
                }


                {/* Show Supplier Name only when in client view (when teamType is "fm") */}
                { request.supplier && request.type!= 'Booking' && teamType == "fm" ?
                <tr onClick = { () => { TeamActions.view.run( request.supplier ) } }>
                    <th>Supplier</th> 
                    <td>{request.supplier.name}</td>
                </tr>
                : null }

                { nextDateString? 
                <tr onClick = { () => { RequestActions.view.run( nextRequest ) } }>
                    <th>Next Due</th>
                    <td>
                        <span onClick = { () => { nextRequest ? RequestActions.view.run( nextRequest ) : RequestActions.view.run( request ) } } >
                            <span>next due <b>{ nextDateString }</b> </span>
                            { nextRequest ? 
                                <span className = {`label label-${nextRequest.status}`}>{ nextRequest.status } { nextRequest.getTimeliness() }</span>
                            : null }
                        </span> 
                    </td>
                </tr>
                : null }

                { previousDateString? 
                <tr onClick = { () => { RequestActions.view.run( previousRequest ) } }>
                    <th>Previous</th>
                    <td>
                        { previousDateString ? 
                            <span onClick = { () => { previousRequest ? RequestActions.view.run( previousRequest ) : RequestActions.view.run( request ) } } >
                                <span>previous <b>{ previousDateString }</b> </span>
                                { previousRequest ? 
                                    <span className = {`label label-${previousRequest.status}`}>{ previousRequest.status } { previousRequest.getTimeliness() }</span>
                                : null }
                            </span> 
                        : null }

                    </td>
                </tr>
                : null }

                { request.type == 'Ad-hoc' && request.costThreshold ?
                <tr>
                    <th>Value</th>
                    <td>${request.costThreshold}</td>
                </tr>
                : null }

                { request.type == 'Booking' && request.duration ?
                <tr>
                    <th>Duration</th>
                    <td>{request.duration}</td>
                </tr>
                : null }

                {request.description ?
                <tr>
                    <th>Description</th>
                    <td>{request.description}</td>
                </tr>:null}

                { request.assignee ?
                <tr>
                    <th>Assignee</th>
                    <td>{request.assignee.getName()}</td>
                </tr> : null }

                </tbody>
            </table>

            <Tabs tabs={[
                {
                    tab:        <span id="discussion-tab"><span>Comments</span>{ request.messageCount?<span>({ request.messageCount })</span>:null}</span>,
                    content:    <Inbox for = { request } truncate = { true }/>
                },{
                    tab:        <span id="documents-tab"><span>Files</span>&nbsp;{ request.attachments?<span className="label">{ request.attachments.length }</span>:null}</span>,
                    content:    <AutoForm model = { Requests } item = { request } form = { ['attachments'] }  afterSubmit={ ( request ) => { 
                      
                request.distributeMessage( {
                    recipientRoles: [ "team", "team manager", "facility", "facility manager" ],
                    message: {
                        verb: "uploaded a file to",
                        subject: "A new file has been uploaded" + ( owner ? ` by ${owner.getName()}` : '' ),
                        body: request.description
                    }
                } );
                        request.markAsUnread(); 
                    } }  />
                },{
                    tab:        <span id="contacts-tab"><span>Contacts</span></span>,
                    //hide:       (teamType == 'contractor'),
                    content:    <ContactList group = { request } readOnly = { true }/>
                }
            ]} />

        </div>
    )
}
