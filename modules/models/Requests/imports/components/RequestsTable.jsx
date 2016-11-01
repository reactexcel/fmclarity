import React from "react";

import { DataTable } from '/modules/ui/DataTable';
import { RequestActions } from '/modules/models/Requests';

export default function RequestsTable( { requests, filter } ) {

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

    if ( filter ) {
        requests = Meteor.user().getRequests( filter );
    }

    return ( 
        <DataTable 
            items = { requests }
            fields = { this.fields }
            onClick = {
                ( request ) => {
                    let team = Session.getSelectedTeam();
                    let supplier = request.supplier;
                    //Issue WO if team id and suppliers id of request matches.
                    if ( request.status == "New" && team._id == supplier._id ) {
                        RequestActions.issue.run( request );
                    }
                    RequestActions.view.run( request )

                }
            } // need a better solution for this
        />
    )
}
