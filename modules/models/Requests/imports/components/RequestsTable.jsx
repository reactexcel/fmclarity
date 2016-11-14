import React from "react";

import { DataTable } from '/modules/ui/DataTable';
import { RequestActions } from '/modules/models/Requests';

import { ContactCard } from '/modules/mixins/Members';

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
    			let color = "#4d4d4d";
    			if ( item.priority == "Critical") {
    				color = "#ff1a1a";
    			} else if ( item.priority == "Urgent" ) {
    				color = "#ff471a";
    			} else if ( item.priority == "Scheduled" ) {
    				color = "#3399ff";
    			} else if ( item.priority == "Standard" ) {
    				color = "#00ccff";
    			} else if ( item.priority == "Closed" ) {
    				color = "#33cc33";
    			}
    			return {
    				val: <span>	<i style = {{width:"15px", color: color, fontSize: "11px"}} className = {"fa fa-arrow-up"}></i>{item.priority}</span>,
                    style: {
                        width: "10px"
                    }
    			}
    		},
    		Status:  ( item ) => {
    			let color = "#4d4d4d";
    			if ( item.status == "Closed" ) {
    				color = "#ff1a1a";
          } else if ( item.status == "New" ) {
    				color = "#33cc33";
          } else if ( item.status == "Issued" ) {
    				color = "#00ccff";
    			}
    			return {
    				val: <span><i style = {{width:"15px", color: color, fontSize: "11px"}} className = {"fa fa-circle "}></i>{item.status}</span>,
    				style: {
    					//color: color
    				}
    			}
    		},
        Facility: "facility.name",
    		"PO#": "code",
    		Issue: "name",
    		Issued: "issuedAt",
    		Due: "dueDate",
    		Supplier: ( item ) => {
          let supplier = item.getSupplier();
          if( supplier != null ){
            return {
              val: <ContactCard item={supplier} />
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
            items = { requests }
            fields = { this.fields }
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
