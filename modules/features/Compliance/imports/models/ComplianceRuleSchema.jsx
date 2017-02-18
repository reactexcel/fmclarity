import { MDPPMEventSelector } from '/modules/features/Compliance';
// import { DocTypes } from '/modules/models/Documents';

import { FacilityListTile, Facilities } from '/modules/models/Facilities';

import ServiceListTile from '../components/ComplianceServiceListTile.jsx';


import { Text, Select, DateInput } from '/modules/ui/MaterialInputs';
import { RequestFrequencySchema, Requests, RequestActions } from '/modules/models/Requests';
import { TeamActions } from '/modules/models/Teams';
import ComplianceDocumentSearchSchema from './ComplianceDocumentSearchSchema.jsx';

import React from 'react';
import moment from 'moment';

var number = null;
export default ComplianceRuleSchema = {

    facility: {
        label: "Facility",
        description: "The site for this job",
        /*relation: {
            type: ORM.OneToOne,
            source: Facilities
        },*/
        input: Select,

        options: ( item ) => {
            let team = Session.getSelectedTeam();
            if( item.facility ) {
              item.facility = Facilities.findOne({ _id: item.facility._id });
            }
            return {
                items: ( team ? team.getFacilities() : null ),
                view: ( Meteor.isClient ? FacilityListTile : null ),
                /*
                transform: ( item ) => {
                    if ( item == null ) {
                        return;
                    }
                    item.level = null;
                    item.area = null;
                    item.identifier = null;
                    item.service = null;
                    item.subservice = null;
                    item.supplier = null;
                }
                */
            }
        },
    },

    type: {
        label: "Check type",
        input: Select,
        options: {
            items: [
                "Document exists",
                "Document is current",
                "PPM schedule established",
                "PPM event completed",
            ],
            afterChange( item ) {
                //console.log( { item } );

            }
        }
    },
    service: {
        label: 'Service',
        type: Object,
        input: Select,
        label: "Service",
        //condition: [ "PPM schedule established", "PPM event completed", "Document exists", "Document is current" ],
        options: function( item ) {
            if ( item.facility ) {
                return {
                    items: item.facility.servicesRequired,
                    view: ServiceListTile
                }
            }
        }
    },

    subservice: {
        type: Object,
        input: Select,
        label: "Sub-Service",
        //condition: item => item.service && [ "PPM event completed", "PPM schedule established" ].indexOf( item.type ) > -1,
        options: function( item ) {
            if ( item.service ) {
                return {
                    items: item.service.children,
                    view: ServiceListTile
                }
            }
        }
    },
    document:{
        type: "object",
        subschema: ComplianceDocumentSearchSchema,
        options(item){
            if ( !item.document ) {
                item.document = { };
            } else if ( item.document && item.document.query && typeof item.document.query === "string") {
                item.document.query = JSON.parse(item.document.query);
            }
        },
        condition: [ "Document exists", "Document is current" ],
    },
    event: {
        label: "PMP event name",
        input: Select,
        condition: [ "PPM event completed", "PPM schedule established" ],
        options( item ) {
            import { Requests } from '/modules/models/Requests';
            return {
                items: Requests.findAll( { "facility._id": item.facility._id, status: "PMP", type: "Preventative" } ),
                addNew: {
                    show: true,
                    label: "Add New",
                    onAddNewItem: ( callback ) => {
                        let team = Session.getSelectedTeam();
                        TeamActions.createRequest.bind( team ).run()
                    }
                }
            }
        }
        /*
        input:Meteor.isClient?MDPPMEventSelector:null,
        options:function(item){
            return {
                facility:item.facility
            }
        }
        */
    },
    lastEventLink: {
        size: 6,
        input( props ) {
            let item = props.item
            let query = {}
            item.event && ( query.name = item.event.name );
            item.service && item.service.name && ( query[ 'service.name' ] = item.service.name );
            item.subservice && item.subservice.name && ( query[ 'subservice.name' ] = item.subservice.name );
            let lastWO = Requests.findAll( query, { $sort: { createdAt: -1 } } )
                //console.log(lastWO[lastWO.length - 1]);
            let team = Session.getSelectedTeam();
            return (
                lastWO.length ? ( <div>
            <span>
              <a className="link" href={"javascript:void(0);"} onClick={() => {
                   RequestActions.view.bind(lastWO[0]).run()
                 }
               }> Previous work order link </a>
            </span>
            <span style={{marginLeft:"5px"}}>status: <strong>{lastWO[lastWO.length - 1].status}</strong></span>
          </div> ) : null
            );
        },
        condition: item => item.event
    },
    nextEventLink: {
        size: 6,
        input( props ) {
            let item = props.item
            let query = {}
            item.event && ( query.name = item.event.name );
            item.service && item.service.name && ( query[ 'service.name' ] = item.service.name );
            item.subservice && item.subservice.name && ( query[ 'subservice.name' ] = item.subservice.name );
            let nextWO = Requests.findAll( query, { $sort: { createdAt: -1 } } )
                //console.log(nextWO[nextWO.length - 2],"asc");
            let team = Session.getSelectedTeam();
            return (
                nextWO.length ? ( <div>
            <span>
              <a className="link" href={"javascript:void(0);"} onClick={() => {
                   RequestActions.view.bind(nextWO[0]).run()
                 }
               }> Next work order link </a>
            </span>
            <span style={{marginLeft:"5px"}}>status: <strong>{nextWO[nextWO.length - 2].status}</strong></span>
          </div> ) : null
            );
        },
        condition: item => item.event
    },
    frequency: {
        type: "object",
        condition: "PPM event completed",
        subschema: RequestFrequencySchema,

    },
    footer:{
        size: 12,
        input( props ){
            let period
            if( props.item.frequency.period && props.item.frequency.number ){
                switch (props.item.frequency.period) {
                    case "daily":
                        period = "day"
                        break;
                    case "fortnightly":
                        period = "fortnight"
                        break;
                    case "weekly":
                        period = "week"
                        break;
                    case "monthly":
                        period = "month"
                        break;
                    case "quarterly":
                        period = "quarter"
                        break;
                    case "annually":
                        period = "year"
                        break;
                    default:

                }
            }
            return (
                <div style={{paddingTop: "10%", fontWeight:"500",fontSize:"16px"}}>
                    {props.item.frequency.number && props.item.frequency.period && props.item.frequency.endDate?
                        <div>
                            {`Repeats every ${props.item.frequency.number} ${period} until ${moment(props.item.frequency.endDate).format("D MMMM YYYY")}`}
                        </div>:(
                            props.item.frequency.number && props.item.frequency.period ?
                            <div>
                                {`Repeats every ${props.item.frequency.number} ${period} until stopped`}
                            </div>:(
                                props.item.frequency.period && props.item.frequency.endDate?
                                <div>
                                    {props.item.frequency.endDate?`Repeat ${props.item.frequency.period} until ${moment(props.item.frequency.endDate).format("D MMMM YYYY")}`:null}
                                </div>:
                                <div>
                                    {props.item.frequency.unit?`Repeat ${props.item.frequency.period || props.item.frequency.unit} until stopped`:null}
                                </div>
                            )
                        )
                    }
                </div>
            );
        }
    },
}
