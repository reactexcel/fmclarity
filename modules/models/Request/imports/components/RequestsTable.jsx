import React from "react";

import { ReactMeteorData } from 'meteor/react-meteor-data';
import { DataTable } from '/both/modules/DataTable';

// RequestsTable
//
// A variation on the 1 column filterbox which includes a left navigation bar
// and a right content section with a large detail view of the selected component
//
// PROPS
//
// items (array)
//      the collection of items to render
//
// filter (object)
//      a mongodb query object used to filter the request results
//
export default RequestsTable = React.createClass( {

    mixins: [ ReactMeteorData ],

    fields: {
        Priority: "priority",
        Status: "status",
        Facility: "facility.name",
        "PO#": "code",
        Issue: "name",
        Issued: "issuedAt",
        Due: "dueDate",
        Supplier: "supplier.name"
    },

    getMeteorData() {
        let statusFilter = { "status": { $nin: [ "Cancelled", "Deleted", "Closed", "Reversed" ] } },
            customFilter = this.props.filter,
            filter = { $and: [ statusFilter, customFilter ] },
            user = Meteor.user(),
            requests = null;

        if ( user != null ) {
            requests = user.getRequests( filter, { expandPMP: true } );
        }

        return { requests }
    },

    render() {
        return (
            <DataTable 
                items   = { this.data.requests } 
                fields  = { this.fields }
                onClick = { ( request ) => { QuickActions.viewRequest( request ) } }
            />
        )
    }
} )
