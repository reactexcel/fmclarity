import { MDPPMEventSelector } from '/modules/features/Compliance';
// import { DocTypes } from '/modules/models/Documents';

import { FacilityListTile, Facilities } from '/modules/models/Facilities';

import ServiceListTile from '../components/ComplianceServiceListTile.jsx';


import { Text, Select, DateInput } from '/modules/ui/MaterialInputs';
import { RequestFrequencySchema, Requests, RequestActions, PPM_Schedulers } from '/modules/models/Requests';
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
                "PPM exists",
                "PPM event completed",
                "Compliance level",
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
        //condition: [ "PPM exists", "PPM event completed", "Document exists", "Document is current" ],
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
        //condition: item => item.service && [ "PPM event completed", "PPM exists" ].indexOf( item.type ) > -1,
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
        condition: [ "Document exists", "Document is current", "Compliance level" ],
    },
    event: {
        label: "PPM event name",
        input: Select,
        condition: [ "PPM event completed", "PPM exists" ],
        options( item ) {
            import { Requests } from '/modules/models/Requests';
            let query = {
                 "facility._id": item.facility._id,
                 type: "Scheduler",
             };
            if ( item.service ) query[ "service.name" ] = item.service.name;
            if ( item.subservice ) query[ "subservice.name" ] = item.subservice.name;
            return {
                /*items: _.pluck(Requests.findAll( query , {
                        fields: {
                             name: true
                         }
                     }
                 ), "name"),*/

                items: _.pluck(PPM_Schedulers.findAll( query , {
                        fields: {
                             name: true
                         }
                     }
                 ), "name"),
                addNew: {
                    show: true,
                    label: "Add New",
                    onAddNewItem: ( callback ) => {
                        let team = Session.getSelectedTeam();
                        let newRequest = PPM_Schedulers.create( {
                            facility: Session.getSelectedFacility(),
                            team: team,
                            type: 'Scheduler',
                            priority: 'Standard',
                            status: 'PPM',
                            name: '',
                            service: item.service,
                            subservice: item.subservice || {},
                            supplier: '',
                            supplierContacts: ''
                        } );
                        TeamActions.createRequest.run( team , callback, newRequest )
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
            item.event && ( query.name = item.event.name ? item.event.name : item.event );
            item.service && item.service.name && ( query[ 'service.name' ] = item.service.name );
            item.subservice && item.subservice.name && ( query[ 'subservice.name' ] = item.subservice.name );

            let lastWO = PPM_Schedulers.findAll( query, { $sort: { createdAt: -1 } } )
            let team = Session.getSelectedTeam();
            let request = lastWO[lastWO.length>1 ? lastWO.length - 2: 0 ],
                dueDate = null,
                previousDate = null,
                previousRequest = null,
                previousDateString = null;
            if ( !_.isEmpty(request) ) {
                previousDate = request.getPreviousDate();
            }
            if( previousDate ) {
                previousRequest = request.findCloneAt( previousDate );
                previousDateString = moment(previousDate).format('ddd Do MMM');
            }
            return (

                previousRequest ? (
                    <span onClick={() => { RequestActions.view.run( previousRequest )}}>
                      <a className="link" href={"javascript:void(0);"}>
                        <span>previous <b>{ previousDateString }</b> </span>
                      </a>
                      <span style={{marginLeft:"5px"}}>
                        <span className = {`label label-${previousRequest.status}`}>{previousRequest.status}</span>
                      </span>
                    </span>) : <span style={{color:'gray'}}>No previous</span>
            );
        },
        condition: item => item.event
    },
    nextEventLink: {
        size: 6,
        input( props ) {
            let item = props.item
            let query = {}
            item.event && ( query.name = item.event.name ? item.event.name : item.event );
            item.service && item.service.name && ( query[ 'service.name' ] = item.service.name );
            item.subservice && item.subservice.name && ( query[ 'subservice.name' ] = item.subservice.name );

            let nextWO = PPM_Schedulers.findAll( query, { $sort: { createdAt: -1 } } )
            let team = Session.getSelectedTeam();
            let request = nextWO[ nextWO.length && nextWO.length>1 ? nextWO.length - 2: 0 ],
                nextDate = null,
                nextRequest = null,
                nextDateString = null;
            if ( !_.isEmpty(request) ) {
                nextDate = request.getNextDate();
            }
            if( nextDate ) {
                nextRequest = request.findCloneAt( nextDate );
                nextDateString = moment(nextDate).format('ddd Do MMM');
            }
            return (
                nextRequest ? (
                <span onClick={() => { RequestActions.view.run( nextRequest )}}>
                  <a className="link" href={"javascript:void(0);"} >
                    <span>next due <b>{ nextDateString }</b> </span>
                  </a>
                  <span style={{marginLeft:"5px"}}>
                    <span className = {`label label-${nextRequest.status}`}>{nextRequest.status}</span>
                  </span>
                </span> ) : <span style={{color:'gray'}}>No next</span>
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
            if( props.item.frequency.period ){
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
                period = period || props.item.frequency.period;
                period = formatSingularPlural(period);
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
                                    {props.item.frequency.endDate?`Repeats ${formatSingularPlural(props.item.frequency.period)} until ${moment(props.item.frequency.endDate).format("D MMMM YYYY")}`:null}
                                </div>:
                                <div>
                                    {props.item.frequency.unit?`Repeats ${props.item.frequency.period?formatSingularPlural(props.item.frequency.period):null || props.item.frequency.unit?formatSingularPlural(props.item.frequency.unit):null} until stopped`:null}
                                </div>
                            )
                        )
                    }
                </div>
            );
        },
        condition: "PPM event completed",
    }
}
function formatSingularPlural(str) {
    if (str.slice(-1)=='s') {
        str =  str.substring(0, str.length-1)+"(s)";
    }
    return str;
}
