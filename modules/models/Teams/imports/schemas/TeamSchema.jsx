import { AddressSchema } from '/modules/models/Facilities';
import { DocExplorer } from '/modules/models/Documents';
import { Text, TextArea, Select } from '/modules/ui/MaterialInputs';
import { Facilities } from '/modules/models/Facilities';
import { ServiceDefaults } from '/modules/mixins/Services';

//import { Facilities } from '/modules/models/Facilities';

export default TeamSchema = {

    //$schema:        "http://json-schema.org/draft-04/schema#",
    //title:            "Team",
    //description:      "An account holder or contact team",

    //properties: 
    //{

    //////////////////////////////////////////////
    // Basic info
    //////////////////////////////////////////////
    name: {
        type: "string",
        label: "Company Name",
        input: Text,
    },

    type: {
        type: "string",
        label: "Account type",
        description: "Is this an account for facility managers or suppliers?",
        input: Select,
        condition: ( item ) => {
            return Meteor.user().emails[ 0 ].address = "mrleokeith@gmail.com"
        },
        options: {
            items: [ "fm", "contractor" ]
        },
    },

    description: {
        label: "Description",
        description: "Brief summary of services provided by this team",
        input: TextArea,
        condition: "contractor"
    },

    email: {
        type: "string",
        description: "The primary email contact for this team",
        input: Text,
        label: "Email",
        //regEx:        ORM.RegEx.Email,
    },

    phone: {
        label: "Primary phone",
        description: "Primary phone contact number",
        icon: "phone",
        input: Text,
        type: "string",
    },

    phone2: {
        label: "Seconday phone",
        type: "string",
        description: "Secondary phone contact number",
        icon: "phone",
        input: Text,
    },

    abn: {
        label: "ABN",
        description: "Australian Business Number",
        type: "string",
        input: Text,
    },

    address: {
        label: "Address",
        description: "Location of primary office",
        subschema: AddressSchema,
    },

    thumb: {
        type: "string",
        label: "Thumbnail",
    },

    //////////////////////////////////////////////
    // Settings
    //////////////////////////////////////////////      

    defaultWorkOrderValue: {
        label: "Default value for work orders",
        description: "Preset initial value for all newly created work orders",
        type: "number",
        input: Text,
        defaultValue: 500,
        condition: "fm"
    },

    services: {
        label: "Services",
        type: "object",
        description: "Services provided by this team",
        input: Select,
        defaultValue: () => {
            return Object.assign( {}, ServiceDefaults );
        }
    },

    timeframes: {
        label: "Time frames",
        type: "object",
        description: "Acceptable turnaround time for jobs of different priorities",
        defaultValue: () => {
            return {
                'Scheduled': 24 * 7 * 3600,
                'Standard': 24 * 3600,
                'Urgent': 2 * 3600,
                'Critical': 1 * 3600
            }
        }
    },

    //////////////////////////////////////////////
    // Relations      
    //////////////////////////////////////////////
    facilities: {
        label: "Facilities",
        description: "Sites maintained by this team",
        relation: {
            //type: ORM.OneToMany,
            //source: "Facilities",
            //key: "team._id"
            join: ( team ) => {
                import { Facilities } from '/modules/models/Facilities';
                return Facilities.findAll( { 'team._id': team._id }, { sort: { name: 1 } } )
            },
            unjoin: ( team ) => {
                return null
            }
        }
    },

    members: {
        label: "Members",
        description: "Members of this team",
    },

    contact: {
        label: "Primary contact",
        description: "Primary contact for the facility",
        relation: {
            join: ( team ) => {
                var managers = team.getMembers( {
                    role: "manager"
                } );
                if ( managers && managers.length ) {
                    return managers[ 0 ];
                }
            },
            unjoin: ( team ) => {
                return null;
            }
        }
    },

    // cull
    suppliers: {
        label: "Suppliers",
        description: "Common suppliers for facilities within this team",
        /*relation:
        {
            type: ORM.HasMembers,
            source: "Teams",
            key: "team._id"
        }*/
    },

    documents: {
        label: "Documents",
        description: "Saved team documents",
        /*relation:
        {
            type: ORM.HasMembers,
            source: "Files",
            key: "team._id"
        },*/
        input: DocExplorer
    },

    /*
        notifications / messages :
        {

        }
      */
    //}
}
