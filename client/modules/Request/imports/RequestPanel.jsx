import React from "react";

import { WorkflowButtons } from 'meteor/fmc:workflow-helper';
import { ContactDetails, ContactList } from 'meteor/fmc:doc-members';
import { AutoForm } from 'meteor/fmc:autoform';

import FacilityDetails from '/client/modules/Facility/imports/FacilityDetails.jsx';
import { ReactMeteorData } from 'meteor/react-meteor-data';

export default RequestPanel = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        let request = null;
        if ( this.props.item && this.props.item._id ) {
            request = Issues.findOne( this.props.item._id );
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
                        <h2>Work Order No { request.code }</h2>

                        { request.service ?
                        <b style={{display:"block",marginBottom:"7px"}}>{ request.getServiceString() }<br/></b>
                        :null }

                        <b>Created</b> <span>{ formatDate( request.createdDate ) }<br/></span>

                        { request.issuedDate ?
                        <span><b>Isssued</b> <span>{ formatDate( request.issuedDate ) }</span><br/></span>
                        :null }

                        { request.dueDate
                        ? <span><b>Due</b> <span>{ formatDate( request.dueDate ) }</span><br/></span>
                        :null }

                        { request.priority ?
                        <span><b>Priority</b> <span>{ request.priority }</span><br/></span>
                        :null }

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

                { request.location?
                <tr>
                    <th>Location</th>
                    <td>{ request.getLocationString() }</td>
                </tr>
                :null }

                { request.supplier ?
                <tr>
                    <th>Supplier</th>
                    <td>{ request.supplier.name }</td>
                </tr>
                :null }

                { request.description ?
                <tr>
                    <th>Description</th>
                    <td>{ request.description }</td>
                </tr>
                :null}

                </tbody>
            </table>

            <IpsoTabso tabs={[
                {
                    tab:        <span id="discussion-tab"><span>Comments</span>{ request.messageCount?<span>({ request.messageCount })</span>:null}</span>,
                    content:    <Inbox for = { request } truncate = { true }/>
                },{
                    tab:        <span id="documents-tab"><span>Files</span>{ request.attachmentCount?<span>({ request.attachmentCount })</span>:null}</span>,
                    content:    <AutoForm model = { Issues } item = { request } form = { ['documents'] } save ={ () => request.save }/>
                },{
                    tab:        <span id="contacts-tab"><span>Contacts</span></span>,
                    content:    <ContactList group = { request } readOnly = { true }/>
                }
            ]} />
        </div>
    )
}
