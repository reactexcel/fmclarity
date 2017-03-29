import DocTypes from '/modules/models/Documents/imports/schemas/DocTypes.jsx';
import { Text, TextArea, Select, DateInput, Currency, Switch } from '/modules/ui/MaterialInputs';

export default ComplianceDocumentSearchSchema = {
    name: {
		label: "Document name",
		type: "string",
		input: Text,
        description:"It's an optional field",
		size: 6,
        options:{
            afterChange( item ) {
                createQuery(item, item.name?{ $regex: item.name, $options: "i" }:"", "name" )
            }
        }
	},
    type: {
		label: "Document type",
		size: 6,
		type: "string",
		input: Select,
		options: {
			items: DocTypes,
            afterChange( item ) {
                createQuery(item, item.type, "type" )
            }
		}
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
            afterChange( item ) {
                createQuery(item, item.insuranceType, "insuranceType" )
            }
		},
		size: 6,
		condition: function( item ) {
			return [
				"Insurance",
			].indexOf( item.type ) > -1;
		},
	},
    reportType: {
		input: Select,
		label: "Report type",
		optional: true,
		options: {
			items:[
				'Validation Report',
			],
            afterChange( item ) {
                createQuery(item, item.insuranceType, "reportType" )
            }
		},
		size: 6,
		condition: "Report",
	},
	confirmationType: {
		input: Select,
		label: "Confirmation type",
		optional: true,
		options: {
			items:[
				'Bunding',
				'Manifest',
				'Signage',
				'Spill bins',
			],
            afterChange( item ) {
                createQuery(item, item.insuranceType, "confirmationType" )
            }
		},
		size: 6,
		condition: "Confirmation",
	},
    logType:{
		input: Select,
		label: "Log type",
		optional: true,
		options: {
			items:[
				'Warden training',
				'Chief Warden training',
			],
            afterChange( item ) {
                createQuery(item, item.logType, "logType" )
            }
		},
		size: 6,
		condition: "Log",
	},
	certificateType:{
		input: Select,
		label: "Certificate type",
		optional: true,
		options: {
			items:[
				'Certificate of Occupancy',
			],
            afterChange( item ) {
                createQuery(item, item.certificateType, "certificateType" )
            }
		},
		size: 6,
		condition: "Certificate",
	},
	registerType:{
		input: Select,
		label: "Register type",
		optional: true,
		options: {
			items:[
				'Incident register',
			],
            afterChange( item ) {
                createQuery(item, item.registerType, "registerType" )
            }
		},
		size: 6,
		condition: "Register",
	},
	registrationType:{
		input: Select,
		label: "Registration type",
		optional: true,
		options: {
			items:[
				'Testing & Tagging certificate',
			],
            afterChange( item ) {
                createQuery(item, item.registrationType, "registrationType" )
            }
		},
		size: 6,
		condition: "Registration",
	},
	procedureType:{
		input: Select,
		label: "Procedure type",
		optional: true,
		options: {
			items:[
				'Restricted access',
			],
            afterChange( item ) {
                createQuery(item, item.procedureType, "procedureType" )
            }
		},
		size: 6,
		condition: "Procedure",
	},
    serviceType: {
        input: Select,
        label: "Service type",
        optional: true,
        type: "object",
        size: 6,
        condition: function( item ) {
            return [
                "Audit",
                "Contract",
                "Inspection",
                "Invoice",
                "MSDS",
                "Plan",
                "Procedure",
                "Quote",
                "Register",
                "Registration",
                "Service Report",
                "SWMS",
            ].indexOf( item.type ) > -1;
        },
        options: function( item ) {
			let selectedTeam = Session.getSelectedTeam(),
				teamType = null,
				items = null;
			if ( selectedTeam ) {
				teamType = selectedTeam.type;
			}

			if ( teamType == 'fm' && item.facility ) {
				items = item.facility.servicesRequired;
			} else if ( teamType == 'contractor' && team.getAvailableServices ) {
				items = team.getAvailableServices();
			}
			return {
				items: items,
                afterChange( item ) {
                    createQuery(item, item.serviceType, "serviceType" )
                }
			}
		}
    },
}

function createQuery( item, value, fieldName ){
    if(!item.query){
        item.query = {
            "facility._id": Session.getSelectedFacility()["_id"],
            $and: []
        };
    }
    if ( !item.query.$and.length) {
        item.query.$and.push( { [fieldName]: value } );
    } else {
        for ( var i in item.query.$and ) {
            if ( item.query.$and[i][fieldName] ) {
                if( !value ){
                    item.query.$and.splice(i,1);
                } else {
                    item.query.$and[i][fieldName] = value;
                }
                break;
            }
            if ( i == item.query.$and.length-1 && !item.query.$and[i][fieldName]){
                item.query.$and.push( { [fieldName]: value } );
            }
        }
    }
}
