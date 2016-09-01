import './AddressSchema.jsx';

TeamSchema = {

    //$schema:        "http://json-schema.org/draft-04/schema#",
    //title:            "Team",
    //description:      "An account holder or contact team",

    //properties: 
    //{

    //////////////////////////////////////////////
    // Basic info
    //////////////////////////////////////////////
    name:
    {
        type: String,
        label: "Company Name",
    },

    type:
    {
        type: String,
        label: "Account type",
        input: "MDSelect",
        condition: ( item ) =>
        {
            return Meteor.user().emails[ 0 ].address = "mrleokeith@gmail.com"
        },
        options:
        {
            items: [ "fm", "contractor" ]
        },
    },

    description:
    {
        label: "Description",
        description: "Brief summary of services provided by this team",
        input: "mdtextarea",
        condition: "contractor"
    },

    email:
    {
        type: String,
        label: "Email",
        //regEx:        ORM.RegEx.Email,
    },

    phone:
    {
        label: "Primary phone",
        description: "Primary phone contact number",
        icon: "phone",
        type: String,
    },

    phone2:
    {
        label: "Seconday phone",
        type: String,
        description: "Secondary phone contact number",
        icon: "phone",
    },

    abn:
    {
        label: "ABN",
        description: "Australian Business Number",
        type: String,
    },

    address:
    {
        label: "Address",
        description: "Location of primary office",
        schema: AddressSchema,
    },

    thumb:
    {
        type: String,
        label: "Thumbnail",
    },

    //////////////////////////////////////////////
    // Settings
    //////////////////////////////////////////////      
    defaultWorkOrderValue:
    {
        label: "Default value for work orders",
        description: "Preset initial value for all newly created work orders",
        type: Number,
        defaultValue: 500,
        condition: "fm"
    },

    services:
    {
        label: "Services",
        type: [ String ],
        description: "Services provided by this team",
        input: "MDSelect",
        defaultValue: () =>
        {
            return JSON.parse( JSON.stringify( Config.services ) )
        }
    },

    timeframes:
    {
        label: "Time frames",
        type: Object,
        description: "Acceptable turnaround time for jobs of different priorities",
        defaultValue: () =>
        {
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
    facilities:
    {
        label: "Facilities",
        description: "Sites maintained by this team",
        relation:
        {
            type: ORM.OneToMany,
            source: "Facilities",
            key: "team._id"
        }
    },

    members:
    {
        label: "Members",
        description: "Members of this team",
        /*relation:     
        { 
            type: ORM.HasMembers, 
            source: "users" 
        }*/
    },

    suppliers:
    {
        label: "Suppliers",
        description: "Common suppliers for facilities within this team",
        /*relation:
        {
            type: ORM.HasMembers,
            source: "Teams",
            key: "team._id"
        }*/
    },

    documents:
    {
        label: "Documents",
        description: "Saved team documents",
        /*relation:
        {
            type: ORM.HasMembers,
            source: "Files",
            key: "team._id"
        },*/
        input: DocAttachments.DocumentExplorer
    },

    /*
        notifications / messages :
        {

        }
      */
    //}
}
