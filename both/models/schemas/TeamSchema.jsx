//might be quite good to have a profile subschema
/*
  {
    name:
    email:
    abn:
    phone:
    thumbnail:
  }
*/
TeamSchema = {

  type: {
    type: String,
    label: "Account type",
  },

  name: {
    type: String,
    label: "Company Name",
    required:true
  },
  thumb: {
    type: String,
    label: "Thumbnail",
  },
  email: {
    type: String,
    label: "Email",
    //regEx: SimpleSchema.RegEx.Email,
  },
  phone: {
    type: String,
    label: "Phone",
  },
  abn: {
    type: String,
    label: "ABN",
  },
  bio : {
    type: String,
    label: "Short bio",
    input:"mdtextarea",
  },

  address:{
    label:"Address",
    schema:AddressSchema,
  },

  defaultWorkOrderValue: {
    type: Number,
    label: "Default value for work orders",
    defaultValue:500
  },
  services : {
    type: [String],
    label: "Services",
    input:"select",
    defaultValue:function(){
        return JSON.parse(JSON.stringify(Config.services));
    }
  },
  timeframes: {
    type:Object,
    label:"Time frames",
    defaultValue:function() {
      return {
        "Scheduled":24*7,
        "Standard":24*3,
        "Urgent":24,
        "Critical":0
      }        
    }
  },
  areasServiced : {
    type: [String],
    label: "Places serviced",
    input:"select",
  },
  //these could be defined as a hasMany relationship
  members: {
    type: [Object],
    relationship:{
      hasMany:Users
    },
    label:"Members"
  },
  contacts: {
    type: [Object],
    relationship:{
      hasMany:Users
    },
    label:"Contacts"
  },
  suppliers: {
    type: [Object],
    relationship:{
      hasMany:Teams
    },
    label: "Suppliers"  
  }
}