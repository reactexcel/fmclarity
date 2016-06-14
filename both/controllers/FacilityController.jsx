// attach schema to the collection
// in terms of code readability it would be nice to put the Facilities = ORM.Collection("Facilities") here
// but with the Meteor load order it would break some of the dependencies
Facilities.schema(FacilitySchema);

//Yes - but doesn't this mean that the schema is not a complete document
//and what about validation?
//well - I think if we are going to do it this way then we should at least have some sort of placeholder in the schema??
// but then again these mixins have their own schemas defined - perhaps we shouldn't concern ourselves
Facilities.mixins([
  DocThumb.config({
    defaultThumbUrl:0
  }),
  DocAttachments.config({
    authentication:AuthHelpers.managerOfRelatedTeam,    
  }),
  DocMessages.config({
    getInboxName:function(){
      return this.getName()+" announcements"
    },
    getWatchers:function() {
      var members = this.getMembers();
      var watchers = [];
      if(members&&members.length) {
        members.map(function(m){
          watchers.push(m);
        })
      }
      return watchers;      
    }
  }),
  DocMembers.config([{
    fieldName:"members",
    authentication:AuthHelpers.managerOfRelatedTeam,
  },{
    fieldName:"tenants",
    authentication:AuthHelpers.managerOfRelatedTeam,
  },{
    fieldName:"suppliers",
    authentication:AuthHelpers.managerOfRelatedTeam,
    /*
    // or???
    authentication:{
      create:AuthHelpers.managerOfRelatedTeam,
      read:AuthHelpers.managerOfRelatedTeam,
      update:AuthHelpers.managerOfRelatedTeam,
      delete:AuthHelpers.managerOfRelatedTeam,
    }
    */    
  }])
]);

//suggestion:
//rename method to writeFunction and helper to readFunction?
Facilities.actions({
  create:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.create.bind(Facilities)
  },
  save:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.save.bind(Facilities)
  },
  destroy:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.destroy.bind(Facilities)
  },
  getAreas:{
    authentication:AuthHelpers.memberOfRelatedTeam,
    helper:function(facility,parent){
      var areas;
      if(parent) {
        areas = parent.children||[];
      }
      areas = facility.areas;
      areas.sort(function(a,b){
        if(a&&a.name&&b&&b.name) {
          return (a.name>b.name)?1:-1;
        }
      })
      return areas;
    }
  },  
  setAreas:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:function(facility,areas){
      Facilities.update(facility._id,{$set:{areas:areas}});
    }
  },
  getServices:{
    authentication:AuthHelpers.memberOfRelatedTeam,
    helper:function(facility,parent){
      var services;
      if(parent) {
        services = parent.children||[];
      }
      else {
        services = facility.servicesRequired||[];
      }
      services.sort(function(a,b){
        if(a&&a.name&&b&&b.name) {
          return (a.name>b.name)?1:-1;
        }
      })
      return services;
    }
  },  
  setServicesRequired:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:function(facility,servicesRequired){
      Facilities.update(facility._id,{$set:{servicesRequired:servicesRequired}});
    }
  },
  getTeam:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    helper:function(facility){
      return Teams.findOne(facility.team._id);
    }
  },
  setTeam:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    helper:function(facility,team){
      Facilities.update(facility._id,{$set:{team:{
          _id:team._id,
          name:team.name        
      }}});
    }
  },
  getAddress:{
    authentication:true,
    helper:function(facility){
      var str = '';
      var a = facility.address;
      if(a) {
        str = 
        (a.streetNumber?a.streetNumber:'')+
        (a.streetName?(' '+a.streetName):'')+
        (a.streetType?(' '+a.streetType):'')+
        (a.city?(', '+a.city):'');
      }
      str = str.trim();
      return str.length?str:null;
    }
  },
  getPrimaryContact:{
    authentication:true,
    helper:function(facility){
      var contacts = facility.getMembers({role:"manager"});
      if(contacts&&contacts.length) {
        return contacts[0]
      }
    }
  },
  getIssues:{
    authentication:true,
    helper:function(facility){
      var team = Session.getSelectedTeam();

      //set base query
      var baseQuery = {'facility._id':facility._id};
      var hasThisTeam = {'$or':[
        {'team._id':team._id},
        {'team.name':team.name}
      ]};
      var hasThisSupplier = {'$or':[
        {'supplier._id':team._id},
        {'supplier.name':team.name}
      ]};

      //inspect role to determine extended query
      var user = Meteor.user();
      var role = facility.getMemberRole(user);
      var extendedQuery;
      switch(role) {
        case 'manager':
          extendedQuery = {'$or':[
            hasThisTeam,
            hasThisSupplier
          ]};
          break;
        case 'staff':
          extendedQuery = {'$or':[
            {'$and':[
              hasThisTeam,
              {'owner._id':user._id},
            ]},
            {'$and':[
              hasThisSupplier,
              {'assignee._id':user._id}
            ]}
          ]};
          break;
        case 'tenant':
          extendedQuery = {'$and':[
              hasThisTeam,
              {'owner._id':user._id},
          ]};
          break;
      }

      //combine base and extended query if neccesary
      var q;
      if(extendedQuery) {
        q = {'$and':[
          baseQuery,
          extendedQuery
        ]};
      }
      else {
        q = baseQuery;
      }

      //execute query
      return Issues.find(q).fetch();
    }
  },
  getIssueCount:{
    authentication:true,
    helper:function(facility){
      return facility.getIssues().length;
    }
  }
})

if(Meteor.isServer) {
  Meteor.publish('facilities',function(){
    return Facilities.find();
  });
}
else {
  Meteor.subscribe('facilities');
}