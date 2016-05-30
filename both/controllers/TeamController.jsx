// this is the controller


Teams.schema(TeamSchema);

DocThumb.register(Teams,{repo:Files});

DocMembers.register(Teams,{
  fieldName:"members",
  authentication:AuthHelpers.managerOrOwner
});

DocMembers.register(Teams,{
  fieldName:"suppliers",
  authentication:AuthHelpers.managerOrOwner
});

DocMessages.register(Teams,{
  getWatchers:function() {
    return this.getMembers({role:"manager"});
    var members = this.getMembers({role:"manager"});
    var watchers = [];
    if(members&&members.length) {
      members.map(function(m){
        watchers.push({
          role:"manager",
          watcher:m
        });
      })
    }
    return watchers;
  }  
});

DocAttachments.register(Teams);

Teams.methods({
  create:{
    authentication:true,
    method:RBAC.lib.create.bind(Teams)
  },
  /*read:{
    //or should we use something that can be passed to subscription?
    Meteor.publish("userData", function () {
      return Meteor.users.find({_id: this.userId},
        {fields: {'other': 1, 'things': 1}});
    });

    fields(role,user,query){
      if(role=="unauthorised") {
        return {
          sensitiveField1:0,
          sensitiveField2:0
        }
      }
    }
  },*/
  //update?
  save:{
    authentication:AuthHelpers.managerOrOwner,
    method:RBAC.lib.save.bind(Teams)
  },
  //delete?
  destroy:{
    authentication:false,
    method:RBAC.lib.destroy.bind(Teams)
  },

  createRequest:{
    authentication:AuthHelpers.manager,
    method:createRequest,    
  },

  inviteMember:{
    authentication:AuthHelpers.managerOrOwner,
    method:inviteMember,
  },




  inviteSupplier:{
    authentication:AuthHelpers.manager,
    method:inviteSupplier,
  },
  /*
  addSupplier:{
    authentication:AuthHelpers.manager,
    method:RBAC.lib.addMember(Teams,'suppliers')
  },
  removeSupplier:{
    authentication:AuthHelpers.manager,
    method:RBAC.lib.removeMember(Teams,'suppliers')
  },
  */

  addFacility:{
    authentication:AuthHelpers.manager,
    method:addFacility,
  },
  addFacilities:{
    authentication:AuthHelpers.manager,
    method:addFacilities,
  },
  destroyFacility:{
    authentication:AuthHelpers.manager,
    method:destroyFacility,
  },
  editFacility:{
    authentication:AuthHelpers.manager,
  }
});

function getSuppliers() {
  var ids=[];
  //if we have any supplier - add their ids to our list of ids
  if(this.suppliers&&this.suppliers.length) {
    this.suppliers.map(function(s){
      ids.push(s._id);
    })
  }

  //also add any suppliers of the issues allocated to us
  var issues = this.getIssues();
  if(issues&&issues.length) {
    issues.map(function(i){
      if(i.team) {
        ids.push(i.team._id);
      }
    })
  }

  return Teams.find({_id:{$in:ids}},{sort:{name:1,_id:1}}).fetch();
}

function inviteSupplier(team,email,ext) {
  var supplier;
  supplier = Teams.findOne({email:email});
  if(!supplier) {
    supplier = Meteor.call("Teams.create",{
      type:"contractor",
      email:email,
      owner:{
        _id:team._id,
        name:team.name,
        type:"team"
      }
    });
    supplier = Teams.findOne(supplier._id);
  }

  //its a subscription issue!!!!
  Meteor.call("Teams.addSupplier",team,{_id:supplier._id},ext);
  return supplier;
}

function createRequest(team,options) {
  team = Teams._transform(team);
  var data = _.extend({},options,{
    team:{
      _id:team._id,
      name:team.getName()
    }
  })
  var result = Issues.create(data);
  return Issues._transform(result);
}

function inviteMember(team,email,ext) {
  var user,id;
  var found = false;
  ext = ext||{};
  //user = Accounts.findUserByEmail(email);
  user = Users.findOne({emails:{$elemMatch:{address:email}}});
  if(user) {
    found = true;
  }
  else {
    var name = FM.isValidEmail(email); // this could be moved to RBAC, or Schema, general purpose validation function
    if(name) {
      if(Meteor.isServer) {
        //Accounts.sendEnrollmentEmail(id);
        var params = {
          name:name,
          email:email
        };
        if(ext.owner) {
          params.owner = ext.owner;
        }
        user = Meteor.call("Users.create",params);
      }
    }
    else {
      return RBAC.error('email-blocked', 'Blocked:', 'Sorry, that email address has been blocked.');
    }
  }
  if(user) {
    Meteor.call("Teams.addMember",team,{_id:user._id},{role:ext.role});
    //return user;
    return {
      user:user,
      found:found
    }
  }
}

function addFacility(team,facility) {
  facility = facility||{};
  facility.team = {
    _id:team._id,
    name:team.name    
  }
  return Facilities.create(facility);
}

function addFacilities(team,facilities) {
  if(_.isArray(facilities)) {
    //throw an error
  }
  //if(!team._helpers) {
    team = Teams.findOne(team._id);
  //}
  facilities.map(function(f){
    team.addFacility(f);
  })
}

function destroyFacility(team,facility) {
  return Facilities.remove(facility._id);
}


Teams.helpers({

  //this is just used for new and sticky
  //perhaps it should be in the view?
  //I don't like it in the model
  isNew() {
    return this.name==null||this.name.length==0;
  },

  getProfile() {
    return this;
  },

  getTimeframe(priority) {
    var timeframes = this.timeframes||{
      "Scheduled":7*24*3600,
      "Standard":24*3600,
      "Urgent":2*3600,
      "Critical":1,
    };
    var timeframe =  timeframes[priority]?timeframes[priority]:timeframes['Standard'];
    return timeframe;
  },
  
  getSuppliers:getSuppliers,

  getNextWOCode(){
    if(!this.counters) {
      this.counters = {};
    }
    if(!this.counters.WO) {
      this.counters.WO = 0;
    }
    this.counters.WO = this.counters.WO + 1;
    Teams.update({_id:this._id},{$inc:{"counters.WO":1}});
    //this.save();
    return this.counters.WO;
  },

  getAvailableServices(parent) {
    var services = parent?parent.children:this.services;
    var availableServices = [];
    if(!services) {
      return;
    }
    services.map(function(service){
      if(service&&service.active) {
        availableServices.push(service);
      }
    });
    return availableServices;
  },

  getFacilities() {
    //return all facilities in my currently selected team
    //and all the facilities in the issues allocated to my team
    var issues,facilityIds = [];
    issues = this.getIssues();
    if(issues&&issues.length) {
      issues.map(function(i){
        if(i.facility) {
          facilityIds.push(i.facility._id);
        }
      })
    }

    return Facilities.find({$or:[
      {"team._id":this._id},
      {_id:{$in:facilityIds}}
    ]},{sort:{name:1}}).fetch();
  },

  getFacility(i) {
    var facilities = this.getFacilities();
    return facilities[i];
  },

  getIssues(q) {
    //this is vulnerable to error - what if the name changes
    //of course if we only have the name then we need to add the id at some point
    var role = this.getMemberRole(Meteor.user());
    if(role=="manager"||role=="fmc support") {
      return this.getManagerIssues(q);
    }
    return this.getStaffIssues(q);
  },

  getManagerIssues(filterQuery) {

    var q;

    var issuesQuery = {$or:[
      //or team member or assignee and not draft
      {$and:[
        {$or:[
          {"team._id":this._id},
          {"team.name":this.name}
        ]},
        {$or:[
          {'owner._id':Meteor.userId()},
          {status:{$nin:[Issues.STATUS_DRAFT]}}
        ]}
      ]},
      //or supplier team member and not draft or new
      {$and:[
        {$or:[
          {"supplier._id":this._id},
          {"supplier.name":this.name}
        ]},
        {$or:[
          {'owner._id':Meteor.userId()},
          {status:{$nin:[Issues.STATUS_DRAFT,Issues.STATUS_NEW]}}
        ]}
      ]}
    ]}

    if(filterQuery) {
      q = {$and:[
        issuesQuery,
        filterQuery
      ]};
    }
    else {
      q = issuesQuery;
    }

    return Issues.find(q).fetch();
  },

  getStaffIssues(filterQuery) {

    var q;

    var issuesQuery = {$or:[
      {'owner._id':Meteor.userId()},
      {$and:[
        {'assignee._id':Meteor.userId()},
        {status:{$nin:[Issues.STATUS_DRAFT]}}
      ]},
    ]}

    if(filterQuery) {
      q = {$and:[
        issuesQuery,
        filterQuery
      ]};
    }
    else {
      q = issuesQuery;
    }

    return Issues.find(q).fetch();

  }

});