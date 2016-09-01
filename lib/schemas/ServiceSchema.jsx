if ( Meteor.isClient )
{
    require( '/client/modules/Facility/MDFacilitySelector.jsx' );
    require( '/client/modules/Compliance/MDPPMEventSelector.jsx' );
}

ComplianceRuleSchema = {
    facility:
    {
        type: Object,
        input: Meteor.isClient ? MDFacilitySelector : null
    },
    type:
    {
        label: "Check type",
        input: "MDSelect",
        options:
        {
            items: [
                "Document exists",
                "Document is current",
                "PPM schedule established",
                "PPM event completed",
            ]
        }
    },
    docType:
    {
        label: "Document type",
        input: "MDSelect",
        condition: [ "Document exists", "Document is current" ],
        options:
        {
            items: DocTypes
        },
    },
    docName:
    {
        label: "Document name",
        condition: [ "Document exists", "Document is current" ]
    },
    service:
    {
        type: Object,
        input: "MDSelect",
        condition: [ "PPM schedule established", "PPM event completed", "Document exists", "Document is current" ],
        options: function( item )
        {
            if ( item.facility )
            {
                return {
                    items: item.facility.servicesRequired,
                    view: ServiceListTile
                }
            }
        }
    },
    event:
    {
        label: "PMP event",
        condition: "PPM event completed",
        /*
        input:Meteor.isClient?MDPPMEventSelector:null,
        options:function(item){
            return {
                facility:item.facility
            }
        }
        */
    },
    frequency:
    {
        condition: "PPM event completed",
        schema: RequestFrequencySchema
    },

}
