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
  },
  attachments: {
    type:[Object],
    label:"Attachments",
    input:DocAttachments.FileExplorer
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
    relationship:{
      hasMany:Users
    },
    label:"Members"
  },
  suppliers: {
    type: [Object],
    label: "Suppliers",
    helpers: {
      getSuppliers:getSuppliers
    },
    actions:{
      /*
      getSuppliers:{
        helper:RBAC.lib.getMembers(Teams,'suppliers'),
      },
      */
      inviteSupplier:{
        authentication:AuthHelpers.manager,
        method:inviteSupplier
      },
      addSupplier:{
        authentication:AuthHelpers.manager,
        method:RBAC.lib.addMember(Teams,'suppliers'),
      },
      removeSupplier:{
        authentication:AuthHelpers.manager,
        method:RBAC.lib.removeMember(Teams,'suppliers'),
      },
    }
  }
}

function getSuppliers() {
  var ids=[];

  if(this.suppliers&&this.suppliers.length) {
    this.suppliers.map(function(s){
      ids.push(s._id);
    })
  }

  var issues = this.getIssues();
  if(issues&&issues.length) {
    issues.map(function(i){
      if(i.team) {
        ids.push(i.team._id);
      }
    })
  }

  return Teams.find({_id:{$in:ids}},{sort:{name:1}}).fetch();
}

function inviteSupplier(team,email,ext) {
  var supplier;
  supplier = Teams.findOne({email:email});
  if(!supplier) {
    supplier = Meteor.call("Teams.create",{
      type:"contractor",
      email:email
    });
  }
  Meteor.call("Teams.addSupplier",team,{_id:supplier._id},ext);
  return supplier;
}