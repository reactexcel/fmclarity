import './AddressSchema.jsx';


FacilitySchema = {
	//$schema:              "http://json-schema.org/draft-04/schema#",
	//title:                "Facility",
	//description:          "A site maintained by a team",

	//properties: 
	//{

	////////////////////////////////////////////////////
	// Basic info
	////////////////////////////////////////////////////

	name:
	{
		label: "Name",
		description: "A short identifier for the building (ie 12 Smith St)",
		type: String,
		autoFocus: true
	},

	address:
	{
		label: "Address",
		description: "The location of the site",
		schema: AddressSchema,
	},

	type:
	{
		label: "Property type",
		input: "MDSelect",
		options:
		{
			items: [
				"Commercial",
				"Retail",
				"Residential",
				"Industrial"
			]
		}
	},

	description:
	{
		label: "Description",
		description: "A brief description of the site",
		type: String,
		input: "mdtextarea",
	},

	size:
	{
		label: "Size",
		description: "The net lettable area in metres squared",
		type: Number,
		size: 6
	},

	operatingTimes:
	{
		label: "Operating times",
		description: "When this site is open",
		type: "period",
		input: "mdtext"
	},

	////////////////////////////////////////////////////
	// Configuration
	////////////////////////////////////////////////////		

	levels:
	{
		label: "Areas",
		description: "The primary areas or zones for this site",
		type: [ Object ],
		defaultValue: () =>
		{
			return JSON.parse( JSON.stringify( Config.defaultLevels ) )
		},
		//input 			levels editor
	},

	areas:
	{
		label: "Building areas",
		description: "The main bookable or maintainable secondary areas for this site",
		type: [ Object ],
		defaultValue: () =>
			{
				return JSON.parse( JSON.stringify( Config.defaultAreas ) )
			}
			//input 			areas editor
	},

	servicesRequired:
	{
		label: "Services Required",
		description: "The services required to maintain this site",
		type: [ Object ],
		defaultValue: () =>
		{
			return JSON.parse( JSON.stringify( Config.services ) )
		}
	},

	////////////////////////////////////////////////////
	// Relations		
	////////////////////////////////////////////////////

	team:
	{
		label: "Team",
		description: "The team that maintains this site",
		relation:
		{
			type: ORM.BelongsTo,
			source: "Teams",
			key: "team._id"
		},
		input: "MDSelect",
		options: ( item ) =>
		{

			return {
				items: Meteor.user().getTeams()
			}

		}
	},

	members:
	{
		label: "Members",
		description: "Stakeholders and staff for this site",
		/*relation:
		{
			type: ORM.HasMembers,
			source: "users"
		}*/
	},

	suppliers:
	{
		label: "Suppliers",
		description: "Contractors supplying services for this facility",
		/*relation:
		{
			type: ORM.HasMembers,
			source: "Teams"
		}*/
	},

	documents:
	{
		label: "Documents",
		description: "Documents pertaining to this facility",
		/*relation:
		{
			type: ORM.ManyToMany,
			source: "Files"
		},*/
		input: DocAttachments.DocumentExplorer
	},

	//}
}
