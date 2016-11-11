import React from "react";

import { DataTable } from '/modules/ui/DataTable';
import { RequestActions } from '/modules/models/Requests';

import { ContactAvatarSmall } from '/modules/mixins/Members';

import moment from 'moment';

export default function RequestsTable( { requests, filter } ) {

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
        Priority: ( item ) => {
            return {
                originalVal: item.priority,                
                val: (<span title = { item.priority } style = { { fontSize:"20px", position:"relative", top:"3px" } } >
                    <i className = {`fa fa-circle priority-${item.priority}`}></i>
                </span>)
            }
        },
        Status: ( item ) => {
            return {
                originalVal: item.status,
                val: <span className = {`label label-${item.status}`}>{item.status}</span>
            }
        },
        Facility: "facility.name",
        "PO#": "code",
        Issue: "name",
        Issued: "issuedAt",
        Due: ( item ) => {
            let dueDate = moment( item.dueDate );
            return {
                originalVal: item.dueDate,
                val: <span className = { dueDate.isBefore() ? "text-overdue" : "" }>{ dueDate.fromNow() }</span>
            }
        },
        Supplier: ( item ) => {
            let supplier = item.getSupplier();
            if ( supplier != null ) {
                return {
                    originalVal: supplier.name,
                    val: <ContactAvatarSmall item = { supplier } />
                }
            }
            return {
                val: <span/>
            }
        },
    }

    if ( filter ) {
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
