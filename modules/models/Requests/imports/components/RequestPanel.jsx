import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Inbox } from '/modules/models/Messages';
import { AutoForm } from '/modules/core/AutoForm';
import { Modal } from '/modules/ui/Modal';
import { AddressLink, BillingDetails } from '/modules/models/Facilities';
import { WorkflowButtons } from '/modules/core/WorkflowHelper';
import { ContactDetails, ContactList } from '/modules/mixins/Members';
import { Tabs } from '/modules/ui/Tabs';
import { Menu } from '/modules/ui/MaterialNavigation';
import { Users, UserPanel } from '/modules/models/Users';
// wouldn't it be nice to go import { Tabs, Menu } from '/modules/ui/MaterialNavigation'

import { Requests, RequestActions } from '/modules/models/Requests';
import { Teams, TeamActions } from '/modules/models/Teams';

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
<<<<<<< HEAD
            owner = null;
=======
            owner = null,
            defaultIndex = this.props.item.hasOwnProperty("tabIndex")? this.props.item.tabIndex : 0;
            date_diff = null ;
>>>>>>> 4bed59afa53f0bf4c278798764d9ba1903775039


        if ( this.props.item && this.props.item._id ) {
            //request = Requests.findOne( this.props.item._id );
            request = Requests.findOne( { _id: this.props.item._id } );
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
<<<<<<< HEAD
        return { request, nextDate, previousDate, nextRequest, previousRequest, facility, contact, realEstateAgency, owner, callback }
=======

        return { request, nextDate, previousDate, nextRequest, previousRequest, facility, contact, realEstateAgency, owner,defaultIndex, callback }

>>>>>>> 4bed59afa53f0bf4c278798764d9ba1903775039
    },

    componentWillMount() {
        //Perf.start();
        //this.data.nextRequest ? RequestActions.view.run( this.data.nextRequest ) : (this.data.previousRequest ? RequestActions.view.run( this.data.previousRequest ): null)
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


const RequestPanelInner = ( { request, nextDate, previousDate, nextRequest, previousRequest, facility, contact, realEstateAgency, owner,defaultIndex, callback } ) => {


    function formatDate( date, onlyDate ) {
        if(onlyDate && onlyDate == true){
            return moment( date ).format( 'ddd Do MMM' );
        }
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

    if (request.invoiceDetails && request.invoiceDetails.details) {
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
        }
        else if (request.type == 'Incident') {
            title = 'Incident';
        }
         else if ( teamType == 'fm' ) {
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
    let userRole = Meteor.user().getRole();
    /*let group = Teams.findOne({'_id':request.supplier._id});
    console.log(Meteor.user(),"member");
    console.log(supplier,"supplier");
    console.log(request.supplier,"request.supplier");
    console.log(group,"request.supplier=>group");
    let role = RBAC.getRole( cont, realEstateAgency );
    console.log(role,"role RBAC");
    role = supplier.getMemberRole( Meteor.user() );
    console.log(role,"role");*/
    var invLength = request.invoiceDetails && request.invoiceDetails.invoiceNumber && request.invoiceDetails.invoiceNumber.length;
    return (
        <div className="request-panel" style={{background:"#eee"}}>

            <div className="wo-detail">
                <div className="row">
                    {_.contains(["staff", "tenant", "resident", undefined], userRole) ? null : <div className="col-md-6 col-xs-6">
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
                        <ContactDetails item = { teamType == "fm" ? ( request.status == "New" ? ( userRole=="staff" ? null : supplier ) : supplier) : contact }/>


                        <BillingDetails item = { requestIsBaseBuilding && realEstateAgency ? realEstateAgency.address : facility.billingDetails }/>

                        { teamType=="contractor" ? <span>{ billingOrderNumber }</span> : null }
                    </div>}
                    <div className="col-md-6 col-xs-6" style={{textAlign: 'right',float:'right'}}>

                            {requestIsInvoice ? <span>
                                <h2 className="edit-link">Invoice #
                                    <input size={invLength} onChange   = { (event) => {
                                        request.invoiceDetails.invoiceNumber = event.currentTarget.value ? event.currentTarget.value : request.invoiceDetails.invoiceNumber;
                                        Requests.save.call( request );

                                        setTimeout(function(){
                                            Bert.alert({
                                              title: 'Success',
                                              message: 'Invoice number updated',
                                              type: 'info',
                                              style: 'growl-top-right',
                                              icon: 'fa-check'
                                            });
                                        }, 500);
                                    } }
                                        type="text" minLength="4" style ={{textAlign:'right'}} value={request.invoiceDetails.invoiceNumber}></input>
                                    </h2>
                                </span>
                                : <h2>{title}</h2>}

                            {/*<b>Created</b> <span>{formatDate(request.createdAt)}<br/></span>*/}

                            { request.type == 'Ad-hoc' || "Ad-Hoc" &&
                              request.costThreshold &&
                              Meteor.user().getRole() != 'staff' && !requestIsInvoice ?
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

                                { (request.type == 'Ad-hoc' || "Ad-Hoc") && request.issuedAt ?
                            <span><b>Issued</b> <span>{formatDate(request.issuedAt)}</span><br/></span>
                            : null }

                            { request.type == 'Ad-hoc' || "Ad-Hoc" && request.dueDate ?

                            <span style={{color : moment(request.dueDate).isBefore() ? "red":"black"}}><b>Due</b> <span>{request.status == "Issued" ? formatDate(request.dueDate,true):formatDate(request.dueDate)}</span><br/></span>

                            : null }

                            { request.type != 'Ad-hoc' && request.type !="Ad-Hoc" && request.createdAt ?
                            <span><b>Created</b> <span>{formatDate(request.createdAt)}</span><br/></span>
                            : null }

                            { request.type == "Incident" && request.incidenceDate ?
                            <span><b>Incident Date</b> <span>{formatDate(request.incidenceDate)}</span><br/></span>
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

                    { request.type == 'Booking' ?
                    <tr>
                        <th>Booked By</th>
                        <td>{ request.memberName || <i>unnamed</i> }</td>
                    </tr>:
                    <tr>
                        <th>Summary</th>
                        <td>{ request.name || <i>unnamed</i> }</td>
                    </tr>
                }

                { request.getLocationString() ?
                <tr>
                    <th>Location</th>
                    <td>{request.getLocationString()}</td>
                </tr>
                : null
                }
                
                { teamType=='fm' && request.service && !_.contains(['Booking', 'Incident'], request.type) ?
                request.type=='Key Request' ?
                Meteor.user().getRole()=='manager'?
                    <tr>
                        <th>Service</th>
                        <td>{request.getServiceString()} {requestIsBaseBuilding?<span className = {`label`}>Base Buildling</span>:null}</td>
                    </tr>: null
                    :
                    <tr>
                        <th>Service</th>
                        <td>{request.getServiceString()} {requestIsBaseBuilding?<span className = {`label`}>Base Buildling</span>:null}</td>
                    </tr>
                : null
                }

                { _.contains(['Incident'], request.type) && request.incidentVictim ?
                <tr>
                    <th>Who did it happen to?</th>
                    <td>{request.incidentVictim}</td>
                </tr>
                : null
                }

                { _.contains(['Incident'], request.type) && request.reporterContact ?
                <tr>
                    <th>Reporter Contact details</th>
                    <td>{request.reporterContact}</td>
                </tr>
                : null
                }

                { _.contains(['Incident'], request.type) && request.location ?
                <tr>
                    <th>Where did it happen?</th>
                    <td>{request.location}</td>
                </tr>
                : null
                }


                { nextDateString?
                <tr style={{'cursor':'pointer'}} title="Select" onClick = { () => { RequestActions.view.run( nextRequest ) } }>
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
                <tr style={{'cursor':'pointer'}} title="Select" onClick = { () => { RequestActions.view.run( previousRequest ) } }>
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

                { request.type == 'Booking' && request.bookingPeriod ?
                <tr>
                    <th style={{width:"110px"}}>Booking Period</th>
                    <td>{(request.bookingPeriod.startTime? moment(request.bookingPeriod.startTime).format('MMMM Do YYYY, h:mm a') : '')+' to '+(request.bookingPeriod.endTime? moment(request.bookingPeriod.endTime).format('MMMM Do YYYY, h:mm a'):'')}</td>
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

            <Tabs defaultIndex = {defaultIndex} tabs={[
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
