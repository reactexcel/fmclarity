import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Inbox } from '/modules/models/Messages';
import { AutoForm } from '/modules/core/AutoForm';
import { AddressLink, BillingDetails } from '/modules/models/Facilities';
import { WorkflowButtons } from '/modules/core/WorkflowHelper';
import { ContactDetails, ContactList } from '/modules/mixins/Members';
import { Tabs } from '/modules/ui/Tabs';
import { Menu } from '/modules/ui/MaterialNavigation';
import { Users, UserPanel } from '/modules/models/Users';
// wouldn't it be nice to go import { Tabs, Menu } from '/modules/ui/MaterialNavigation'

import { Requests, RequestActions } from '/modules/models/Requests';
import { TeamActions } from '/modules/models/Teams';

import moment from 'moment';

import Perf from 'react-addons-perf';

export default RequestPanel = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {

        let request = null,
            nextRequest = null,
            previousRequest = null,
            nextDate = null,
            previousDate = null,
            contact = null,
            facility = null,
            realEstateAgency = null,
            owner = null;

        if ( this.props.item && this.props.item._id ) {
            request = Requests.findOne( this.props.item._id );

            if ( request ) {
                Meteor.subscribe( 'Inbox: Messages', request._id );
                owner = request.getOwner();
                facility = request.getFacility();

                if( facility ) {
                    realEstateAgency = facility.getRealEstateAgency();
                    //console.log( realEstateAgency );
                }

                contact = request.getContact();
                supplier = request.getSupplier();
                if ( request.type == 'Preventative' ) {
                    nextDate = request.getNextDate();
                    previousDate = request.getPreviousDate();
                    nextRequest = request.findCloneAt( nextDate );
                    previousRequest = request.findCloneAt( previousDate );
                }
            }
        }
        let callback = this.props.callback
        return { request, nextDate, previousDate, nextRequest, previousRequest, facility, contact, realEstateAgency, owner, callback }
    },

    componentWillMount() {
        //Perf.start();
        this.data.nextRequest ? RequestActions.view.run( this.data.nextRequest ) : (this.data.previousRequest ? RequestActions.view.run( this.data.previousRequest ): null)
    },

    componentDidMount() {
        /*Perf.stop();
        console.log('Outputing mount load time analysis for request panel...');
        Perf.printInclusive();*/
        // Perf.printWasted();
    },

    componentDidUpdate() {
        /*Perf.stop();
        console.log('Outputing update load time analysis for request panel...');
        Perf.printInclusive();*/
        // Perf.printWasted();
    },

    render() {
        return <RequestPanelInner { ...this.data }/>
    }
} );


const RequestPanelInner = ( { request, nextDate, previousDate, nextRequest, previousRequest, facility, contact, realEstateAgency, owner, callback } ) => {

    function formatDate( date ) {
        return moment( date ).format( 'ddd Do MMM, h:mm a' );
    }
    function showUserModal( selectedUser ) {

            Modal.show( {
                content: <UserPanel
                    item    = { selectedUser }
                    team    = { Session.get( 'selectedTeam' ) }
                    group   = { facility }/>
            } )

    }

    function showMoreUsers() {
        $('.seen-by-list li:hidden').slice(0, 2).show();
        if ($('.seen-by-list li').length == $('.seen-by-list li:visible').length) {
            $('#view-more ').hide();
        }
    }

    if ( !request ) {
        return <div/>
    }
    let teamType = Session.get( 'selectedTeam' ).type,
        title = "",
        billingOrderNumber = "",
        nextDateString = null,
        previousDateString = null,
        requestIsBaseBuilding = false,
        requestIsPurchaseOrder = false,
        requestIsInvoice = false;

    if( request.service && request.service.data ) {
        requestIsBaseBuilding = request.service.data.baseBuilding;
        requestIsPurchaseOrder = request.service.data.purchaseOrder;
    }

    if (request.invoiceDetails) {
        requestIsInvoice = true;
    }

    if ( request.type == 'Preventative' ) {
        title = 'PPM';
        if ( nextDate ) {
            nextDateString = moment( nextDate ).format( 'ddd Do MMM YYYY' );
        }
        if ( previousDate ) {
            previousDateString = moment( previousDate ).format( 'ddd Do MMM YYYY' );
        }

    } else {
        if ( request.type == 'Booking' ) {
            title = 'Room Booking';
        } else if ( teamType == 'fm' ) {
            if ( requestIsPurchaseOrder ) {
                title = "Purchase Order";
            } else {
                title = "Work Order";
            }
        } else {
            title = "Job";
        }
        if ( request.code ) {
            title += ` # ${request.code}`
            billingOrderNumber += ` WO# ${request.code}`
        } else {
            title = "New " + title;
        }
    }
    if(requestIsInvoice) {
        title = ` Invoice # ${request.invoiceDetails.invoiceNumber}`;
    }

    let url = '/requests/print/' + request._id;
    var viewers = [];
    request.readBy ? request.readBy.map( function( u, idx ) {
        var user = Meteor.users.findOne( u._id );
        if ( ( request.readBy.length - 1 ) != idx && u._id != Meteor.userId() ) {
            viewers.push( user.profile.name );
        }

    } ) : null;
    request.readBy=_.uniq(request.readBy, '_id');
    return (
        <div className="request-panel" style={{background:"#eee"}}>

            <div className="wo-detail">
                <div className="row">
                    <div className="col-md-6 col-xs-6">
                        {/* Show supplier name when user is client (fm),
                            otherwise show client name for supplier user */}
                        <h2>
                            {   teamType=="fm" && request.supplier && request.supplier.name
                                ?
                                "Supplier: "+ request.supplier.name
                                :
                                "Client: "+ ( requestIsBaseBuilding && realEstateAgency ? realEstateAgency.name : request.team.name )
                            }
                        </h2>
                        <AddressLink item = { facility.address }/>

                        {/* Show supplier contact details when user is client (fm),
                            otherwise show client details for supplier user */}
                        <ContactDetails item = { teamType == "fm" ? supplier : contact }/>

                        <BillingDetails item = { requestIsBaseBuilding && realEstateAgency ? realEstateAgency.address : facility.billingDetails }/>

                        { teamType=="contractor" ? <span>{ billingOrderNumber }</span> : null }
                    </div>
                    <div className="col-md-6 col-xs-6" style={{textAlign: 'right'}}>

                            <h2>{title}</h2>

                            {/*<b>Created</b> <span>{formatDate(request.createdAt)}<br/></span>*/}

                            { request.type == 'Ad-hoc' &&
                              request.costThreshold &&
                              Meteor.user().getRole() != 'staff' ?
                            <h2>${request.costThreshold}</h2>
                            : null }

                            {requestIsInvoice ?
                                <div>
                                <span><b>Invoice Date</b> <span>{formatDate(request.invoiceDetails.invoiceDate)}</span><br/></span>
                                <span><b>Due Date</b> <span>{formatDate(request.invoiceDetails.dueDate)}</span><br/></span>
                                
                                <span
                                style       = { { display:"inline-block",fontSize:"16px",marginTop:"20px"}}
                                className   = { "label label-"+request.invoiceDetails.status}
                            >

                                {request.invoiceDetails.status}

                            </span>
                                </div>
                                :
                                <div>

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
                            }

                            

                            

                    </div>
                </div>

            </div>

            <div style={{textAlign:"right",paddingRight:"20px"}} className="no-print">
              <div className="row">
                <div className="col-md-1">
                  <div>
                    <button onClick={()=>{FlowRouter.go( url );}} className="btn btn-flat">
                      <i className="fa fa-print" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
                <div className="col-md-11">
                  <WorkflowButtons actions = { RequestActions } item = { request } callback={callback}/>
                </div>
              </div>
            </div>

            <table>
            {requestIsInvoice
                ?
                <tbody>
                    <tr>
                        <th>Details</th>
                        <td>{ request.invoiceDetails.details || <i>unnamed</i> }</td>
                    </tr>
                    <tr>
                        <th>Service</th>
                        <td>{ request.service.name || <i>unnamed</i> }</td>
                    </tr>
                    <tr>
                        <th>GST</th>
                        <td>{ request.invoiceDetails.gst || <i>unnamed</i> }</td>
                    </tr>
                    <tr>
                        <th>Total</th>
                        <td>{ request.invoiceDetails.totalPayable || request.costThreshold }</td>
                    </tr>
                </tbody>
                :
                <tbody>
                <tr>
                    <th>Summary</th>
                    <td>{ request.name || <i>unnamed</i> }</td>
                </tr>

                { request.getLocationString() ?
                <tr>
                    <th>Location</th>
                    <td>{request.getLocationString()}</td>
                </tr>
                : null
                }

                { teamType=='fm' && request.service && request.type != 'Booking' ?
                <tr>
                    <th>Service</th>
                    <td>{request.getServiceString()} {requestIsBaseBuilding?<span className = {`label`}>Base Buildling</span>:null}</td>
                </tr>
                : null
                }


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

                { request.type == 'Booking' && request.duration ?
                <tr>
                    <th>Duration</th>
                    <td>{request.duration}</td>
                </tr>
                : null }

                { request.priority != "PMP" && teamType=='fm' && request.eta && Meteor.user().getRole() != 'staff' ?
                <tr>
                    <th>ETA</th>
                    <td>{formatDate(request.eta)}</td>
                </tr> : null }

                { request.readBy && request.readBy.length ?
                request.readBy.length == 1 && request.readBy[0]._id==Meteor.userId() ? null :
                    <tr>
                        <td></td>
                        <td>
                            <ul className="seen-by-list">
                            <li ><i className="fa fa-check"></i>&nbsp;&nbsp;<span>Seen by </span></li>
                                {request.readBy.map(function(u, idx){
                                    var user = Meteor.users.findOne(u._id);
                                    if (u._id == Meteor.userId()) {
                                        user = null;
                                    }
                                    return (
                                        user ? <li key={u._id}><a href="#" onClick={()=>{showUserModal( user );}} title={formatDate(u.readAt)}>{ user.profile ? user.profile.name : user.name}</a></li>: null
                                    )
                                })}

                            </ul>

                        </td>
                    </tr> : null }
                </tbody>
            }

            </table>

            <Tabs tabs={[
                {
                    tab:        <span id="discussion-tab"><span>Comments</span>{ request.messageCount?<span>({ request.messageCount })</span>:null}</span>,
                    content:    <Inbox for = { request } truncate = { true }/>
                },{
                    hide:       !_.contains( [ 'fmc support', 'portfolio manager', 'manager', 'property manager' ], Meteor.user().getRole()),
                    tab:        <span id="documents-tab" className="no-print"><span>Files</span>&nbsp;{ request.attachments?<span className="label">{ request.attachments.length }</span>:null}</span>,
                    content:    <AutoForm model = { Requests } item = { request } form = { ['attachments'] }  afterSubmit={ ( request ) => {

                request.distributeMessage( {
                    recipientRoles: [ 'team manager', 'facility manager', 'supplier manager', 'assignee' ],
                    message: {
                        verb: "uploaded a file to",
                        subject: "A new file has been uploaded" + ( owner ? ` by ${owner.getName()}` : '' ),
                        body: request.description
                    }
                } );
                        request.markAsUnread();
                    } }  />
                },{
                    tab:        <span id="contacts-tab" className="no-print"><span>Contacts</span></span>,
                    hide:       (teamType == 'contractor'),
                    content:    <ContactList
                                    hideMenu    = { _.contains( [ 'staff', 'resident', 'tenant' ], Meteor.user().getRole() ) }
                                    group       = { request }
                                    readOnly    = { true }
                                />
                }
            ]} />

        </div>
    )
}
