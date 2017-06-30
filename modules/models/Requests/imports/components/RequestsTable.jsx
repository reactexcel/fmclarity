import React from "react";

import { DataTable } from '/modules/ui/DataTable';
import { RequestActions } from '/modules/models/Requests';

import { ContactAvatarSmall } from '/modules/mixins/Members';

import moment from 'moment';

export default function RequestsTable( { requests, filter, columns } ) {

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
                    { item.status == 'Complete' ? null : <i className = {`fa fa-circle priority-${item.priority}`}></i> }
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
        "WO#": ( item ) => {
            return {
                val:item.code? item.code : "",
                originalVal: item.code
            }
        },
        "Issue": "name",
        "Amount": "costThreshold",
        "Issued": ( item ) => {
            let issuedAt = null,
                title = '',
                value = '';
            if( item.issuedAt ) {
                issuedAt = moment( item.issuedAt );
                title = issuedAt.format( 'ddd Do MMM, h:mm a' );
                value = moment(item.issuedAt, "DD/MM/YY").format("DD/MM/YY");
            }
            return {
                originalVal: item.issuedAt,
                val: <span title = { title }>{ value }</span>
            }
        },
        "Due": ( item ) => {
            let dueDate = moment( item.dueDate );
						let dueString
						let year = dueDate.diff(moment(),"years")
						let month
						let days
						let hours
						let minutes
						let seconds
						dueString = year > 1 || year < -1 ? Math.abs(year) + " " + "years" : Math.abs(year) + " " + "year"
						if(year === 0){
							month = dueDate.diff(moment(),"months")
							dueString = month > 1 || month < -1 ? Math.abs(month) + " " + "months" : Math.abs(month) + " " + "month"
						}
						if(month === 0){
							days = dueDate.diff(moment(),"days")
							dueString = days > 1 || days < -1 ? Math.abs(days) + " " + "days" : Math.abs(days) + " " + "day"
						}
						if(days === 0){
							hours = dueDate.diff(moment(),"hours")
							dueString = hours > 1 || hours < -1 ? Math.abs(hours) + " " + "hours" : Math.abs(hours) + " " + "hour"
						}
						if(hours === 0){
							minutes = dueDate.diff(moment(),"minutes")
							dueString = minutes > 1 || minutes < -1 ? Math.abs(minutes) + " " + "minutes" : Math.abs(minutes) + " " + "minute"
						}
						if(minutes === 0){
							seconds = dueDate.diff(moment(),"seconds")
							dueString = seconds > 1 || seconds <  -1 ? Math.abs(seconds) + " " + "seconds" : Math.abs(seconds) + " " + "second"
						}
						if(seconds === 0 ){
							dueString = "few seconds ago"
						}

            return {
                originalVal: item.dueDate,
                val: <span className = { dueDate.isBefore() ? "text-overdue" : "" }>{ dueString }</span>
            }
        },
		//use square brackets for dynamic JSON keys (as variables)
		[ ClientOrSupplier ] : ( item ) => {

			if ( team.type == 'fm' ) {
				let supplier = item.getSupplier();
                if( supplier ) {
    				return {
    					originalVal: supplier.name,
    					val: <ContactAvatarSmall item = { supplier } />
    				} ;
                }
			}
			else{
				let client = item.getTeam();
                if ( client ) {
    				return {
    					originalVal: client.name,
    					val: <ContactAvatarSmall item = { client } />
    				} ;
                }
			}
		},
    }

    if ( filter ) {
        requests = Meteor.user().getRequests( { $and:[
            { 'status': { $in: ['New','Issued'] } },
            filter
        ] });
    }
    if (Session.get( 'selectedFacility' )) {
            delete this.fields['Facility'];
        }
        var requiredColumns = columns ? $.grep(columns, function(element) {
                                return $.inArray(element, Object.keys(this.fields) ) !== -1;
                                }) : Object.keys(this.fields);
        var newCols={};
        requiredColumns.map(function(col){
            newCols[col] = this.fields[col];
        });

    return (
        <div className = "request-table">
        <DataTable
            items   = { requests }
            fields  = { newCols }
            sortByColumn = "Issued"
            sortDirection = "up"
            onClick = {
                ( request ) => {
                    let team = Session.getSelectedTeam();
                    let supplier = request.supplier;
                    RequestActions.view.run( request )

                }
            }
        />
        </div>
    )
}
