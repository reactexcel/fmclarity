import React from "react";

import { DataTable } from '/modules/ui/DataTable';
import { RequestActions } from '/modules/models/Requests';

import { ContactAvatarSmall } from '/modules/mixins/Members';

import moment from 'moment';

export default function RequestsTable( { requests, filter } ) {

	let team = Meteor.user().getTeam();
	//when in client (fm) view, show supplier, else if in supplier view show client on table column name.
	let ClientOrSupplier = team.type == 'fm' ? 'Supplier' : 'Client'; 
    this.fields = {
        /*  Priority: "priority",
        Status: "status",
        Facility: "facility.name",
        "PO#": "code",
        Issue: "name",
        Issued: "issuedAt",
        Due: "dueDate",
        //Supplier: "supplier.name"
        Supplier: ( item ) => {
                return {
                    val: <ContactCard item={item} />
                }
            }*/
        "Prty": ( item ) => {
            return {
                originalVal: item.priority,                
                val: (<span title = { item.priority } style = { { fontSize:"20px", position:"relative", top:"3px" } } >
                    <i className = {`fa fa-circle priority-${item.priority}`}></i>
                </span>)
            }
        },
        "Status": ( item ) => {
            return {
                originalVal: item.status,
                val: <span className = {`label label-${item.status}`}>{item.status}</span>
            }
        },
        "Facility": "facility.name",
        "PO#": ( item ) => {
            return {
                val:item.code? item.code : "",
                originalVal: item.code
            }
        },
        "Issue": "name",
        "Issued": "issuedAt",
        "Due": ( item ) => {
            let dueDate = moment( item.dueDate );
            return {
                originalVal: item.dueDate,
                val: <span className = { dueDate.isBefore() ? "text-overdue" : "" }>{ dueDate.fromNow() }</span>
            }
        },
		//use square brackets for dynamic JSON keys (as variables)
		[ ClientOrSupplier ] : ( item ) => {
			
			if ( team.type == 'fm' ) {
				let supplier = item.getSupplier();
				return {
					originalVal: supplier.name,
					val: <ContactAvatarSmall item = { supplier } />
				} ;
			}
			else{
				let client = item.getOwner();
				return {
					originalVal: client.name,
					val: <ContactAvatarSmall item = { client } />
				} ;
			}
		},
    }

    if ( filter ) {
        //let statusFilter = { "status": { $nin: [ "Cancelled", "Deleted", "Closed", "Reversed", "PMP", "Rejected" ] } },
        requests = Meteor.user().getRequests( filter );
    }

    return ( 
        <DataTable 
            items   = { requests }
            fields  = { this.fields }
            onClick = {
                ( request ) => {
                    let team = Session.getSelectedTeam();
                    let supplier = request.supplier;
                    //Issue WO if team id and suppliers id of request matches.
                    /*if ( request.status == "New" && team && supplier && team._id == supplier._id ) {
                        RequestActions.issue.run( request );
                    }*/
                    RequestActions.view.run( request )

                }
            } // need a better solution for this
        />
    )
}
