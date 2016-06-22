Issues.schema(IssueSchema);

//register this collection with the DocMessages package
//so that documents within this collection can receive messages
DocMessages.register(Issues,{
  getInboxName:function() {
    return "work order #"+this.code+' "'+this.getName()+'"';
  },
  getWatchers:function() {

    var user, owner, team, supplier, assignee;

    user = Meteor.user();
    owner = this.getOwner();

    //don't include suppliers and assignees if draft or new
    //is this deprecated?
    if(this.status!=Issues.STATUS_DRAFT) {
      team = this.getTeam();
      if(this.status!=Issues.STATUS_NEW) {
        supplier = this.getSupplier();
        assignee = this.getAssignee();
      }
    }
    return [user,owner,supplier,team,assignee];
  }
});

//register this collection with the DocMembers package
//to create a "members" field that can be used for RBAC
DocMembers.register(Issues,{
  authentication:function(role,user,request) {
    return (
      AuthHelpers.memberOfRelatedTeam(role,user,request)||
      AuthHelpers.managerOfSuppliersTeam(role,user,request)
    )
  }
});

function isEditable(request) {
  return (
    request.status=="Draft"||request.status=="New"
  )        
}

var accessForTeamMembers = function(role,user,request) {
  return (
    isEditable(request)&&
    AuthHelpers.memberOfRelatedTeam(role,user,request)
  )
}

var accessForTeamManagers = function(role,user,request) {
  return (
    isEditable(request)&&
    AuthHelpers.managerOfRelatedTeam(role,user,request)
  )
}

var accessForTeamMembersWithElevatedAccessForManagers = function(role,user,request) {
  return (
    (
      request.status=="Issued"&&
      AuthHelpers.managerOfRelatedTeam(role,user,request)
    )
    ||
    (
      isEditable(request)&&
      AuthHelpers.memberOfRelatedTeam(role,user,request)
    )
  )
}

//maybe actions it better terminology?
Issues.methods({
  setName:{
    authentication:accessForTeamMembers,
  },
  setDescription:{
    authentication:accessForTeamMembers,
  },
  setFacility:{
    authentication:accessForTeamMembers,
    method:Issues._schema['facility'].setter,
  },
  setPriority:{
    authentication:accessForTeamMembersWithElevatedAccessForManagers,
    method:setPriority,
  },
  setService:{
    authentication:accessForTeamMembers,
    method:setService
  },
  setSubService:{
    authentication:accessForTeamMembers,
    method:setSubService
  },
  setCost:{
    authentication:accessForTeamMembersWithElevatedAccessForManagers,
  },
  setDueDate:{
    authentication:accessForTeamMembersWithElevatedAccessForManagers,
  }, 
  setArea:{
    authentication:accessForTeamMembers,
    method:setArea
  },
  setSubarea:{
    authentication:accessForTeamMembers,
    method:setSubarea
  },
  setAreaIdentifier:{
    authentication:accessForTeamMembers,
    method:setAreaIdentifier
  },
  
  setSupplier:{
    authentication:accessForTeamManagers,
    method:setSupplier
  },
  setAssignee:{
    authentication:function(role,user,request) {
      return (
        AuthHelpers.managerOfSuppliersTeam(role,user,request)
      )
    },
    method:setAssignee
  },

  getFacility:{
    authentication:true,
    helper:AccessHelpers.hasOne({
      collection:Facilities,
      fieldName:"facility"
    })
  },


  getTeam:{
    authentication:true,
    helper:AccessHelpers.hasOne({
      collection:Teams,
      fieldName:"team"
    })
  },

  getArea:{
    authentication:true,
    helper:function(team) {
      return team.area;
    }
  }
})

function setArea(request,area) {
  //level = area, area = subarea
  Issues.update(request._id,{$set:{
    'level':area,
    'area':0
  }})
}

function setSubarea(request,subarea) {
  if(request.level) {
    Issues.update(request._id,{$set:{
      'area':subarea
    }})    
  }
}

function setAreaIdentifier(request,identifier) {
  if(request.area) {
    Issues.update(request._id,{$set:{
      'area.identifier':identifier
    }})
  }
}

function setPriority(request,priority) {
  if(!request) {
    return;
  }
  var newDueDate = makeDueDate(request,priority);
  //should also update due date in this function
  Issues.update(request._id,{$set:{
    priority:priority,
    urgent:(priority=="Urgent"||priority=="Critical"),
    dueDate:newDueDate,
  }})
}

//changes the supplier for a work request
function setSupplier(request,supplier) {
  if(!request) {
    return;
  }

  //if supplier is null then delete existing supplier
  if(!supplier) {
    Issues.update(request._id,{$set:{
      assignee:null,
      supplier:null
    }});

  }
  //otherwise update supplier accordingly
  else {
    Issues.update(request._id,{$set:{
      assignee:null,
      supplier:{
        _id:supplier._id,
        name:supplier.name
      }
    }});
  }
}

function getSupplier(query) {
  query = query||this.supplier;
  if(query&&(query._id||query.name)) {
    var q = query._id?{_id:query._id}:
      query.name?{name:query.name}:
      query;
    return Teams.findOne(q);
  }
}

function setService(request,service) {
  request = Issues._transform(request);
  Issues.update(request._id,{$set:{
    service:service,
    subservice:null
  }});
  //if(request.canSetSupplier()) {
    if(service.data&&service.data.supplier) {
      //dangerously bypass supplier permissions
      setSupplier(request,service.data.supplier);
    }
    else {
      //dangerously bypass supplier permissions
      setSupplier(request,null);
    }
  //}
}

function setSubService(request,subservice) {
  request = Issues._transform(request);
  Issues.update(request._id,{$set:{subservice:subservice}});
  //if(request.canSetSupplier()) {
    if(subservice.data&&subservice.data.supplier) {
      //dangerously bypass RBAC
      setSupplier(request,subservice.data.supplier);
    }
    else {
      //dangerously bypass RBAC
      setSupplier(request,null);
    }
  //}
}

function setAssignee(request,assignee) {
  Issues.update(request._id,{$set:{
    assignee:{
      _id:assignee._id,
      name:assignee.profile.name
    }
  }});

  //this should be handled the same way as supplier is not
  // that is to say, member should not be added until request is "issued"
  // or in this case we need to create another issue status and should not be added until
  // say - "assigned"?
  request = Issues._transform(request);
  Issues.update(request._id,{$pull:{members:{role:"assignee"}}});
  //dangerously bypass RBAC
  request.dangerouslyAddMember(request,assignee,{role:"assignee"});
}

function getAssignee() {
  return this.assignee?Users.findOne(this.assignee._id):null;
}

function getPotentialSuppliers() {
  if(this.service&&this.service.name) {
    var team = this.getTeam();
    if(!team) {
      return;
    }
    var query = {};
    var ids = [];
    team.suppliers.map(function(supplier){
      ids.push(supplier._id);
    })
    query = {
      _id:{$in:ids},
      services:{$elemMatch:{
        name:this.service.name,
        active:true
      }}
    };
    /*
    if(this.subservice&&this.subservice.name) {
      query['services.children'] = { $elemMatch : {
          name:this.subservice.name,
          active:true
      }};
    }*/
    var teams = Teams.find(query,{sort:{name:1}}).fetch();
    return teams;
  }
  return null;
}

Issues.helpers({
  // this sent to schema config
  // or put in another package document-urls
  path:'requests',
  getUrl() {
    return Meteor.absoluteUrl(this.path+'/'+this._id)
  },
  getEncodedPath() {
    return encodeURIComponent(Base64.encode(this.path+'/'+this._id));
  }
});

function makeDueDate(request,priority) {
  if(!request.team) {
    return new Date();
  }
  var team = Teams.findOne(request.team._id);
  var timeframe = team.timeframes[priority]*1000;
  var createdMs = request.createdAt.getTime();
  return new Date(createdMs+timeframe);
}

Issues.helpers({
  //determines when to set stick and/or when to delete on page change
  isNew:function() {
    return this.status==Issues.STATUS_DRAFT;
  },
  isEditable:function() {
    return this.isNew()||Issues.STATUS_NEW;
  },
  getPotentialSuppliers:getPotentialSuppliers,
  getAssignee:getAssignee,
  getSupplier:getSupplier,
  isOverdue:function() {
    return moment(this.dueDate).isBefore();
  },
  isFollowUp:function(){
    return this.parent!=null;
  },
  isSticky:function(){/*
    if(this.priority=="Urgent"||this.priority=="Critical") {
      return "Urgent";
    }
    else if(this.isOverdue()) {
      return "Overdue";
    }
    else if(this.isFollowUp()&&this.status==Issues.STATUS_NEW) {
      return "Approval required";
    }
    else */if(this.sticky==true) {
      return "Sticky";
    }
    return null;
  }
});

Issues.helpers({
  //doc-attachments
  getAttachmentCount() {
    if(this.attachments) {
      return this.attachments.length;
    }
    return 0;
  },
});
