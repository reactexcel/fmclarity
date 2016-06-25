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
    label:"Account type",
    input:"MDSelect",
    options:{items:["fm","contractor"]},
    condition(item) {
      var user = Meteor.user();
      return user.emails[0].address="mrleokeith@gmail.com";
    }
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
  phone2: {
    type: String,
    label: "Phone 2",
  },
  abn: {
    type: String,
    label: "ABN",
  },
  description: {
    label: "Description",
    input:"mdtextarea",
    condition:function(item) {
      return item.type=="contractor"
    }
  },

  attachments: {
    type:[Object],
    label:"Attachments",
    input:DocAttachments.FileExplorer
  },

  documents: {
      type:[Object],
      label:"Documents",
      input:DocAttachments.DocumentExplorer
  },

  address:{
    label:"Address",
    schema:AddressSchema,
  },

  defaultWorkOrderValue: {
    type: Number,
    label: "Default value for work orders",
    defaultValue:500,
    condition:function(item) {
      return item.type=="fm"
    }

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
        "Scheduled":24*7*3600,
        "Standard":24*3600,
        "Urgent":2*3600,
        "Critical":1*3600
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
    label:"Members"
  },
  suppliers: {
    type: [Object],
    label: "Suppliers"
  }
}
