import './AddressSchema.jsx';
import { DocExplorer } from 'meteor/fmc:doc-attachments';
import { Text, TextArea, Select } from 'meteor/fmc:doc-attachments';

FacilitySchema = {
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
		autoFocus: true
	},

	address: {
		label: "Address",
		description: "The location of the site",
		schema: AddressSchema,
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
		input: TextArea,
	},

	size: {
		label: "Size",
		description: "The net lettable area in metres squared",
		type: "number",
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
		defaultValue: () => {
			return JSON.parse( JSON.stringify( Config.defaultLevels ) )
		},
		//input 			levels editor
	},

	areas: {
		label: "Building areas",
		description: "The main bookable or maintainable secondary areas for this site",
		type: [ Object ],
		defaultValue: () => {
				return JSON.parse( JSON.stringify( Config.defaultAreas ) )
			}
			//input 			areas editor
	},

	servicesRequired: {
		label: "Services Required",
		description: "The services required to maintain this site",
		type: [ Object ],
		defaultValue: () => {
			return JSON.parse( JSON.stringify( Config.services ) )
		}
	},

	////////////////////////////////////////////////////
	// Relations		
	////////////////////////////////////////////////////

	team: {
		label: "Team",
		description: "The team that maintains this site",
		relation: {
			type: ORM.BelongsTo,
			source: "Teams",
			key: "team._id"
		},
		input: Select,
		options: ( item ) => {

			return {
				items: Meteor.user().getTeams()
			}

		}
	},

	members: {
		label: "Members",
		description: "Stakeholders and staff for this site",
		relation: {
			join: ( facility ) => {
				let ids = _.pluck( facility.members, '_id' );
				if ( !_.isEmpty( ids ) ) {
					return Users.find( { _id: { $in: ids } } ).fetch();;
				}
			},
			unjoin: ( facility ) => {
				let members = [];
				facility.members.map( ( member ) => {
					members.push( _.pick( member, '_id', 'name', 'role' ) );
				} )
			}
		}
	},

	suppliers: {
		label: "Suppliers",
		description: "Contractors supplying services for this facility",
		relation: {
			join: ( facility ) => {
				let ids = _.pluck( facility.suppliers, '_id' );
				if ( !_.isEmpty( ids ) ) {
					return Teams.find( { _id: { $in: ids } } ).fetch();
				}
			},
			unjoin: ( facility ) => {
				let suppliers = [];
				facility.suppliers.map( ( supplier ) => {
					suppliers.push( _.pick( supplier, '_id', 'name', 'role' ) );
				} )
			}
		}
		/*relation:
		{
			type: ORM.HasMembers,
			source: "Teams"
		}*/
	},

	documents: {
		label: "Documents",
		description: "Documents pertaining to this facility",
		/*relation:
		{
			type: ORM.ManyToMany,
			source: "Files"
		},*/
		input: DocExplorer
	},

	thumbUrl: {
		label: "Thumbnail URL",
		description: "URL for an icon-sized image of the facility",
		relation: {
			join: ( facility ) => {
				return facility.getThumbUrl()
			},
			unjoin: ( facility ) => {
				return null
			}
		}
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
	}

	//}
}
