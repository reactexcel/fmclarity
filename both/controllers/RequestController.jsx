Issues.schema(IssueSchema);

DocMessages.register(Issues,{
  getInboxName:function() {
    return "work order #"+this.code+' "'+this.getName()+'"';
  },
  getWatchers:function() {
    var user = Meteor.user();
    var owner = this.getOwner();
    var team = this.getTeam();
    var supplier = this.getSupplier();
    var assignee = this.getAssignee();
    //and facilityContact?
    return [user,owner,supplier,team,assignee];
    return [
      {
        role:"active user",
        watcher:user
      },
      {
        role:"owner",
        watcher:owner
      },
      {
        role:"team",
        watcher:team
      },
      {
        role:"supplier",
        watcher:supplier
      },
      {
        role:"assignee",
        watcher:assignee
      },
    ];
  }
});

DocMembers.register(Issues,{
  authentication:{
    add:function(){
      return true;
    }
  }
});

var accessForTeamMembers = function(role,user,request) {
  return (
    isEditable(request)&&
    AuthHelpers.memberOfRelatedTeam(role,user,request)
  )
}

/**
 *
 */
function isEditable(request) {
  return (
    request.status==Issues.STATUS_DRAFT||request.status==Issues.STATUS_NEW
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
    authentication:accessForTeamMembers,
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
    authentication:function(role,user,request) {
      return (
        (isEditable(request)||request.status==Issues.STATUS_ISSUED)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    },
  },
  setDueDate:{
    authentication:accessForTeamMembers,
  } , 
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
    authentication:accessForTeamMembers,
    method:setSupplier
  },
  setAssignee:{
    authentication:function(role,user,request) {
      return (
        AuthHelpers.memberOfSuppliersTeam(role,user,request)
      )
    },
    method:setAssignee
  },
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

function setSupplier(request,supplier) {
  if(!request) {
    return;
  }

  Issues.update(request._id,{$pull:{members:{role:"supplier manager"}}});

  if(!supplier) {

    Issues.update(request._id,{$set:{supplier:null}});

  }
  else {

    Issues.update(request._id,{$set:{
      supplier:{
        _id:supplier._id,
        name:supplier.name
      }
    }});

    request = Issues._transform(request);
    supplier = request.getSupplier(supplier);
    var supplierMembers = supplier.getMembers({role:"manager"});
    request.addMember(supplierMembers,{role:"supplier manager"});
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
  if(request.canSetSupplier()) {
    if(service.data&&service.data.supplier) {
      request.setSupplier(service.data.supplier);
    }
    else {
      request.setSupplier(null);
    }
  }
}

function setSubService(request,subservice) {
  request = Issues._transform(request);
  Issues.update(request._id,{$set:{subservice:subservice}});
  if(request.canSetSupplier()) {
    if(subservice.data&&subservice.data.supplier) {
      request.setSupplier(subservice.data.supplier);
    }
    else {
      request.setSupplier(null);
    }
  }
}

function setAssignee(request,assignee) {
  Issues.update(request._id,{$set:{
    assignee:{
      _id:assignee._id,
      name:assignee.profile.name
    }
  }});
  request = Issues._transform(request);
  Issues.update(request._id,{$pull:{members:{role:"assignee"}}});
  request.addMember(assignee,{role:"assignee"});
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
