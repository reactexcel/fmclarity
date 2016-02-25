TeamSchema = {
  name: {
    type: String,
    label: "Company Name",
    required:true
  },
  abn: {
    type: String,
    label: "ABN",
    },
    contactName: {
      type: String,
      label: "Contact name",
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
    website: {
      type: String,
      label: "Website",
      size:6
    },
    facebook: {
      type: String,
      label: "Facebook",
      size:6
    },
    addressLine1 :{
      type: String,
      label: "Address line 1",
      size:6
    },
    addressLine2 :{
      type: String,
      label: "Address line 2",
      size:6
    },
    city :{
      type: String,
      label: "City/Suburb",
      size:3
    },
    state :{
      type: String,
      label: "State",
      size:3
    },
    country :{
      type: String,
      label: "Country",
      size:3
    },
    postcode :{
      type: String,
      label: "Postcode/ZIP",
      size:3
    },
    headline : {
      type: String,
      label: "My headline",
      input:"mdtextarea",
    },
    bio : {
      type: String,
      label: "Short bio",
      input:"mdtextarea",
    },
    references : {
      type: String,
      label: "References",
      input:"mdtextarea",
    },
    thumb: {
      type: String,
      label: "Thumbnail",
    },
    type: {
      type: String,
      label: "Account type",
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
    modules: {
      type: Object,
      label: "Active modules",
      input:"switchbank",
      defaultValue:function(item) {
        if(item.type=='fm') {
            return {
                "Dashboard":true,
                "Portfolio":true,
                "PMP":false,
                "ABC":false,
                "Repairs":true,
                "Suppliers":true,
                "Sustainability":false,
                "Contracts":false,
                "Reports":false
            };
        }
        else {
            return {
                "Dashboard":false,
                "Portfolio":true,
                "PMP":false,
                "ABC":false,
                "Repairs":true,
                "Suppliers":false,
                "Sustainability":false,
                "Contracts":false,
                "Reports":false
            };
        }        
      }
    },
    //these could be defined as a hasMany relationship
    members: {
      type: [Object],
      relationship:{
        hasMany:Users
      },
      label:"Members"
    },
    suppliers: {
      type: [Object],
      relationship:{
        hasMany:Teams
      },
      label: "Suppliers"  
    }
}