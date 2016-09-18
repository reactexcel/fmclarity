import React from "react";

import { DataTable } from '/modules/ui/DataTable';

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

    return (
        <DataTable 
            items   = { props.requests } 
            fields  = { this.fields }
            onClick = { ( request ) => { QuickActions.viewRequest( request ) } }
        />
    )
}
