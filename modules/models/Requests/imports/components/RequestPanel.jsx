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
        let request = null;
        if ( this.props.item && this.props.item._id ) {
            request = Requests.findOne( this.props.item._id );
        }
        return { request }
    },

    render() {
        return <RequestPanelInner request = { this.data.request } />
    }
} );


const RequestPanelInner = ( { request } ) => {

    function formatDate( date ) {
        return moment( date ).format( 'ddd Do MMM, h:mm a' );
    }

    if ( !request ) {
        return <div/>
    }
    let teamType = Session.get('selectedTeam').type;
    return (
        <div className="request-panel" style={{background:"#eee"}}>

            <div className="wo-detail">
                <div className="row">
                    <div className="col-md-6">
                        <h2>{ request.team.name }</h2>
                        <FacilityDetails item = { request.facility }/>
                        <ContactDetails item = { request.owner }/>
                    </div>
                    <div className="col-md-6" style={{textAlign: 'right'}}>

                            { request.type == 'Booking' && request.code ?

                                <h2>Room Booking No {request.code}</h2>

                            : request.type == 'Booking' && !request.code ?

                                <h2>Booking</h2>

                            : !request.code ?

                                <h2>Work Order</h2>

                            :

                                <h2>{ teamType=='fm'?"Work Order":"Job" } # {request.code}</h2>

                            }

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

                { request.location ?
                <tr>
                    <th>Location</th>
                    <td>{request.getLocationString()}</td>
                </tr>
                : null
                }

                { request.supplier && request.type!= 'Booking' ?
                <tr onClick = { () => { TeamActions.view.run( request.supplier ) } }>
                    <th>Supplier</th>
                    <td>{request.supplier.name}</td>
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

                {request.description?                 
                <tr>
                    <th>Description</th>
                    <td>{request.description}</td>
                </tr>:null}

                </tbody>
            </table>

            <Tabs tabs={[
                {
                    tab:        <span id="discussion-tab"><span>Comments</span>{ request.messageCount?<span>({ request.messageCount })</span>:null}</span>,
                    content:    <Inbox for = { request } truncate = { true }/>
                },{
                    tab:        <span id="documents-tab"><span>Files</span>{ request.attachmentCount?<span>({ request.attachmentCount })</span>:null}</span>,
                    content:    <AutoForm model = { Requests } item = { request } form = { ['attachments'] } hideSubmit = { true } />
                },{
                    tab:        <span id="contacts-tab"><span>Contacts</span></span>,
                    content:    <ContactList group = { request } readOnly = { true }/>
                }
            ]} />

        </div>
    )
}
