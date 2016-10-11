/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import './AddressSchema.jsx';
import { Documents, DocExplorer } from '/modules/models/Documents';
import { Text, TextArea, Select } from '/modules/ui/MaterialInputs';

/**
 * @memberOf 		module:models/Facilities
 */
const FacilitySchema = {
	//$schema:              "http://json-schema.org/draft-04/schema#",
	//title:                "Facility",
	//description:          "A site maintained by a team",

	//properties:
	//{

	////////////////////////////////////////////////////
	// Basic info
	////////////////////////////////////////////////////

	name: {
		label: "Name",
		description: "A short identifier for the building (ie 12 Smith St)",
		type: "string",
		input: Text,
		autoFocus: true
	},

	address: {
		label: "Address",
		description: "The location of the site",
		type: "object",
		subschema: AddressSchema,
	},

	type: {
		label: "Property type",
		input: Select,
		options: {
			items: [
				"Commercial",
				"Retail",
				"Residential",
				"Industrial"
			]
		}
	},

	description: {
		label: "Description",
		description: "A brief description of the site",
		type: "string",
		optional: true,
		input: TextArea,
	},

	size: {
		label: "Size",
		description: "The net lettable area in metres squared",
		type: "number",
		optional: true,
		input: Text,
		size: 6
	},

	operatingTimes: {
		label: "Operating times",
		description: "When this site is open",
		type: "period",
		input: Text
	},

	////////////////////////////////////////////////////
	// Configuration
	////////////////////////////////////////////////////

	levels: {
		label: "Areas",
		description: "The primary areas or zones for this site",
		type: [ Object ],
		//defaultValue: () => {
		//return JSON.parse( JSON.stringify( Config.defaultLevels ) )
		//},
		//input 			levels editor
	},

	areas: {
		label: "Building areas",
		description: "The main bookable or maintainable secondary areas for this site",
		type: [ Object ],
		//defaultValue: () => {
		//return JSON.parse( JSON.stringify( Config.defaultAreas ) )
		//}
		//input 			areas editor
	},

	servicesRequired: {
		label: "Services Required",
		description: "The services required to maintain this site",
		type: [ Object ],
		//defaultValue: () => {
		//return JSON.parse( JSON.stringify( Config.services ) )
		//}
	},

	////////////////////////////////////////////////////
	// Relations
	////////////////////////////////////////////////////

	team: {
		label: "Team",
		description: "The team that maintains this site",
		/*relation: {
			join: ( item ) => {
				if ( item.team && item.team._id ) {
					return Teams.findOne( item.team._id );
				}
			},
			unjoin: ( item ) => {
				return _.pick( item.team, '_id', 'name' );
			}
		},*/
		input: Select,
		options: ( item ) => {

			return {
				items: Meteor.user().getTeams()
			}

		}
	},

	members: {
		label: "Members",
		description: "Stakeholders and staff for this site"
	},

	suppliers: {
		label: "Suppliers",
		description: "Contractors supplying services for this facility",
	},

	contact: {
		label: "Primary contact",
		description: "Primary contact for the facility",
		relation: {
			join: ( facility ) => {
				var contacts = facility.getMembers( {
					role: "manager"
				} );
				if ( contacts && contacts.length ) {
					return contacts[ 0 ]
				}
			},
			unjoin: ( facility ) => {
				return null
			}
		}
	},

    documents: {
        label: "Documents",
        description: "Saved facility documents",
        /*relation:
        {
            type: ORM.HasMembers,
            source: "Files",
            key: "team._id"
        },*/
        input: DocExplorer
    },


	//}
}

export default FacilitySchema;
