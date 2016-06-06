Facilities.schema(FacilitySchema);

DocThumb.register(Facilities,{
  defaultThumbUrl:0
});

DocMembers.register(Facilities,{
  fieldName:"members",
  authentication:AuthHelpers.managerOfRelatedTeam,
});

DocMembers.register(Facilities,{
  fieldName:"suppliers",
  authentication:AuthHelpers.managerOfRelatedTeam,
  membersCollection:Teams
});

DocMessages.register(Facilities,{
  getInboxName() {
    return this.getName()+" announcements";
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
});

Facilities.methods({
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

})

// how would it be if these went in the schema?
// would make RBAC a lot easier
Facilities.helpers({

  getIssues() {
  	return Issues.find({"facility._id":this._id}).fetch();
  },

  getTeam() {
    return Teams.findOne(this.team._id);
  },  

  setTeam(team) {
  	this.save({
  		team:{
  			_id:team._id,
  			name:team.name
  		}
  	})
  },

  isNew() {
  	return this.name==null||this.name.length==0;
  },

  getName() {
  	//return this.name?(this.name+', '+this.address.city):'';
  	return this.name;
  },

  getAddress() {
    var str = '';
  	var a = this.address;
    if(a) {
      str = 
      (a.streetNumber?a.streetNumber:'')+
      (a.streetName?(' '+a.streetName):'')+
      (a.streetType?(' '+a.streetType):'')+
      (a.city?(', '+a.city):'');
    }
    str = str.trim();
    return str.length?str:null;
  },

  getAreas(parent) {
    return mergeWithTeamArray(this,'areas',parent);
  },

  getServices(parent) {
    return mergeWithTeamArray(this,'servicesRequired',parent);
  },

  getAllSuppliers() {
    return mergeWithTeamArray(this,'suppliers');
  },

  getPrimaryContact() {
    var contacts = this.getMembers({role:"manager"});
  	if(contacts&&contacts.length) {
      return contacts[0]
    }
  },

  getIssueCount() {
  	return Issues.find({"facility._id":this._id}).count();
  }

});

function mergeWithTeamArray(item,field,parent) {
    var items;

    //if indexing children of another service
    if(parent) {
      items = parent.children;
    }
    //else merge team services with facility services
    else {
      items = item[field]?item[field]:[];
      var team = item.getTeam();
      if(team&&team[field]) {
        items = items.concat(team[field]);
      }
      items.sort(function(a,b){
        if(a&&a.name&&b&&b.name) {
          return (a.name>b.name)?1:-1;
        }
      })
      items = _.uniq(items,true,function(i){return i&&i.name?i.name:null});
    }
    return items;
}
