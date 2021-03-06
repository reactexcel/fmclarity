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
    authentication:AuthHelpers.managerOfRelatedTeam,
    helpers:{
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
    }
  }),
  DocMembers.config([{
    authentication:AuthHelpers.managerOfRelatedTeam,
    fieldName:"members",
  },{
    fieldName:"suppliers",
    authentication:AuthHelpers.managerOfRelatedTeam,
    membersCollection:Teams,
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
  setServiceSupplier:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:function(facility,serviceIdx,subserviceIdx,supplier) {
      console.log(supplier);
      console.log(facility);

      if(serviceIdx) {
        facility = Facilities._transform(facility);

        //create update location string
        updateLocation = ("servicesRequired."+serviceIdx);
        if(subserviceIdx) {
          updateLocation += (".children."+subserviceIdx);
        }
        updateLocation += ".data.supplier";

        //create update structure
        var update = {$set:{}};
        update.$set[updateLocation] = supplier?{
          _id:supplier._id,
          name:supplier.name
        }:null;

        Facilities.update(facility._id,update);
        facility.addSupplier(supplier);
      }
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
  //this is not allowing for suppliers who have a request with this facility
  getIssues:{
    authentication:true,
    helper:function(facility){
      var team = Session.getSelectedTeam();
      if(team){
        return team.getIssues({"facility._id":facility._id});
      }
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