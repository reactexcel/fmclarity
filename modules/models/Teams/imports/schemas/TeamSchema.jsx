import { DocExplorer } from '/modules/models/Documents';
import { Text, TextArea, Select, ABN, Phone } from '/modules/ui/MaterialInputs';
import { Facilities, AddressSchema } from '/modules/models/Facilities';
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
        required: true,
    },

    type: {
        type: "string",
        label: "Account type",
        description: "Is this an account for facility managers or suppliers?",
        input: Select,
        required: true,
        condition: ( item ) => {
            return Meteor.user().emails[ 0 ].address = "mrleokeith@gmail.com"
        },
        options: {
            items: [
                { name: 'Facility Management', val: "fm" },
                { name: 'Supplier', val: "contractor" },
                { name: 'Real Estate Agent', val: "real estate" }
            ]
        },
    },

    description: {
        label: "Company Profile",
        description: "Brief summary of services provided by this team",
        input: TextArea,
        condition: "contractor"
    },

    website: {
        label: "Website",
        type: "string",
        description: "Company's website url",
        input: Text,
        condition: "contractor"
    },

    email: {
        type: "string",
        description: "The primary email contact for this team",
        input: Text,
        required: true,
        label: "Email",
        //regEx:        ORM.RegEx.Email,
    },

    phone: {
        label: "Primary phone",
        description: "Primary phone contact number",
        icon: "phone",
        input: Phone,
        type: "phone",
    },

    phone2: {
        label: "Secondary phone",
        type: "phone",
        description: "Secondary phone contact number",
        icon: "phone",
        input: Phone,
    },

    abn: {
        label: "ABN",
        description: "Australian Business Number",
        type: "abn",
        input: ABN,
    },

    address: {
        type: "object",
        condition: "contractor",
        subschema: {

                streetNumber: {
                    input: Text,
                    label: "Number",
                    type: "string",
                    size: 3
                },
                streetName: {
                    input: Text,
                    type: "string",
                    label: "Street name",
                    size: 6
                },
                city: {
                    input: Text,
                    label: "City",
                    size: 6,
                    type: "string",
                },
                state: {
                    label: "State",
                    size: 3,
                    input: Select,
                    type: "string",
                    options: {
                        items: [
                            "ACT",
                            "NSW",
                            "SA",
                            "TAS",
                            "NT",
                            "QLD",
                            "VIC",
                            "WA"
                        ]
                    }
                },
                postcode: {
                    input: Text,
                    label: "Postcode",
                    type: "string",
                    size: 3
                }
            }

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

    defaultCostThreshold: {
        label: "Threshold value for work orders",
        description: "Maximum value set for the value of a work order",
        type: "number",
        input: Text,
        defaultValue: 1000,
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

    documents: {
        label: "Documents",
        description: "Saved team documents",
        input: DocExplorer
    },

}
