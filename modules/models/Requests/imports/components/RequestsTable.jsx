import React from "react";

import { DataTable } from '/modules/ui/DataTable';
import { RequestActions } from '/modules/models/Requests';

export default function RequestsTable( props ) {

    this.fields = {
        Priority: "priority",
        Status: "status",
        Facility: "facility.name",
        "PO#": "code",
        Issue: "name",
        Issued: "issuedAt",
        Due: "dueDate",
        Supplier: "supplier.name"
    }

    var user = Meteor.user();

    var data = user.getRequests( props.filter );

    //console.log( props.requests );

    return (
        <DataTable
            items   = { data } 
            fields  = { this.fields }
            onClick = { ( request ) => { RequestActions.view.run( request ) } } // need a better solution for this
        />
    )
}
