import { MDPPMEventSelector } from '/modules/features/Compliance';
// import { DocTypes } from '/modules/models/Documents';

import { FacilityListTile } from '/modules/models/Facilities';

import ServiceListTile from '../components/ComplianceServiceListTile.jsx';


import { Text, Select, DateInput } from '/modules/ui/MaterialInputs';
import { RequestFrequencySchema } from '/modules/models/Requests';

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
            ]
        }
    },

    docType: {
        label: "Document type",
        input: Select,
        condition: [ "Document exists", "Document is current" ],
        options( item ) {
            // Import DocTypes here to remove circular dependency.
            import { DocTypes } from '/modules/models/Documents';
            return{
              items: DocTypes,
            };
        },
    },

    insuranceType: {
  		input: Select,
  		label: "Insurance type",
  		optional: true,
  		options: {
  			items:[
  				'Public Liablity',
  				'Professional Indemnity',
  				'Worker\'s Compensation',
  				'Other',
  			],
  		},
  		size: 12,
  		condition: function( item ) {
  			return [
  				"Insurance",
  			].indexOf( item.docType ) > -1;
  		},
  	},

    expiryDate: {
  		type: "date",
  		condition: function( item ) {
  			return [
  				'Bank Guarantee',
  				'Contract',
  				'Emergency Management',
  				'Insurance',
  				'Lease',
  				'Quote',
  				'Register',
  				'Registration'
  			].indexOf( item.docType ) > -1;
  		},
  		defaultValue: function( item ) {
  			return new Date();
  		},
  		label: "Expiry",
  		optional: true,
  		size: 12,
  		input: DateInput,
  	},

    docName: {
        label: "Document name",
        input: Text,
        condition: [ "Document exists", "Document is current" ]
    },

    service: {
        label: 'Service',
        type: Object,
        input: Select,
        label: "Service",
        condition: [ "PPM schedule established", "PPM event completed", "Document exists", "Document is current" ],
        options: function( item ) {
            if ( item.facility ) {
                return {
                    items: item.facility.servicesRequired,
                    view: ServiceListTile
                }
            }
        }
    },

    event: {
        label: "PMP event",
        input: Text,
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

    frequency: {
        condition: "PPM event completed",
        subschema: RequestFrequencySchema
    }

}
