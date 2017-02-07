import { MDPPMEventSelector } from '/modules/features/Compliance';
// import { DocTypes } from '/modules/models/Documents';

import { FacilityListTile, Facilities } from '/modules/models/Facilities';

import ServiceListTile from '../components/ComplianceServiceListTile.jsx';


import { Text, Select, DateInput } from '/modules/ui/MaterialInputs';
import { RequestFrequencySchema, Requests, RequestActions } from '/modules/models/Requests';
import { TeamActions } from '/modules/models/Teams';
import ComplianceDocumentSearchSchema from './ComplianceDocumentSearchSchema.jsx';

import React from 'react';

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
                console.log( { item } );

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
            console.log({item},"sub service");
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
        condition: "PPM event completed",
        subschema: {
            number: {
                label: "Frequency (number)",
                description: "The number of days, weeks, months etc between repeats",
                input: Text,
                type: "number",
                defaultValue: 6,
                size: 6,
                options: {
                    afterChange( item ) {
                        number = item.number;
                    }
                }
            },
            unit: {
                label: "Frequency (unit)",
                description: "The unit (days, weeks, months etc) of the repeats",
                input( props ) {
                    return (
                        <Select
                  placeholder={props.placeholder}
                  item={props.item}
                  items={props.items}
                  value={props.value?(props.value==="custom"?"Custom":"Repeat "+props.value+" until stopped"):""}
                  onChange={ item => props.onChange(item) }
                />
                    );
                },
                defaultValue: "months",
                type: "string",
                size: 6,
                options: {
                    items: [
                        { name: 'Daily', val: "daily" },
                        { name: 'Weekly', val: "Weekly" },
                        { name: 'Fortnightly', val: "fortnightly" },
                        { name: 'Monthly', val: "monthly" },
                        { name: 'Quarterly', val: "quarterly" },
                        { name: 'Annually', val: "annually" },
                        { name: 'Custom', val: "custom" },
                    ]
                },
                condition: item => item.number.length,
            },

            period: {
                label: "Period",
                description: "The unit (days, weeks, months etc) of the repeats",
                input( props ) {
                    return (
                        <Select
                  placeholder={props.placeholder}
                  item={props.item}
                  items={props.items}
                  value={props.value?"Repeat every "+ (number||"")+" "+props.value:""}
                  onChange={ item => props.onChange(item) }
                />
                    );
                },
                defaultValue: "months",
                type: "string",
                size: 6,
                options: {
                    items: [
                        { name: 'Daily', val: "daily" },
                        { name: 'Weekly', val: "Weekly" },
                        { name: 'Fortnightly', val: "fortnightly" },
                        { name: 'Monthly', val: "monthly" },
                        { name: 'Quarterly', val: "quarterly" },
                        { name: 'Annually', val: "annually" },
                    ]
                },
                condition: item => item.unit === "custom",
            },
            repeats: {
                label: "Repeats",
                description: "The number of times this item should happen",
                input: Text,
                type: "number",
                defaultValue: 6,
                size: 6,
                condition: item => item.number.length && item.unit === "custom",
            },

            endDate: {
                label: 'End date',
                size: 6,
                input: DateInput,
                condition: item => item.unit === "custom"
            }
        }
    }

}
