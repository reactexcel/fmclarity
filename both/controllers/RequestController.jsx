Issues.schema(IssueSchema);

DocMessages.register(Issues,{
  /**
   * Would be nice to put this (email functionality) in a separate package
   * Then abstract it down to it's own api and optimise/refactor
   */

  // I reckon trash getInboxName and make getInboxId explicit in each class that uses it
  // furthermore could make a package with a factory that enables this
  // The package could also include the model and view for Messages!
  getInboxName() {
    return "work order #"+this.code+' "'+this.getName()+'"';
  },

  sendMessage(message,cc,opts) {
    cc = cc||this.getWatchers();
    var user = Meteor.user();

    message.inboxId = this.getInboxId();
    message.target = this.getInboxId();
    message.owner = {
      _id:user._id,
      name:user.getName()
    }

    Meteor.call("Messages.create",message,function(err,messageId){
      message.originalId = messageId;
      if(cc&&cc.length) {
        cc.map(function(recipient){
          if(recipient) {
            if(message.verb=="issued"&&recipient.type=="contractor") {
              recipient.sendMessage(message,null,{doNotEmail:true});
            }
            else {
              recipient.sendMessage(message,null,opts);
            }
          }
        })
      }
    })
  },
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
    method:RBAC.lib.setItem(Issues,'priority'),
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
  setLevel:{
    authentication:accessForTeamMembers,
  },
  setArea:{
    authentication:accessForTeamMembers,
  },
  
  addMember:{
    authentication:true,
    method:RBAC.lib.addMember(Issues,'members')// this is ORM, not RBAC
  },
  removeMember:{
    authentication:false,
    method:RBAC.lib.removeMember(Issues,'members')
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

function getWatchers() {
  var user = Meteor.user();
  var owner = this.getOwner();
  var team = this.getTeam();
  var supplier = this.getSupplier();
  var assignee = this.getAssignee();
  //and facilityContact?
  return [user,owner,supplier,team,assignee];
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


Issues.helpers({
  //determines when to set stick and/or when to delete on page change
  isNew:function() {
    return this.status==Issues.STATUS_DRAFT;
  },
  isEditable:function() {
    return this.isNew()||Issues.STATUS_NEW;
  },
  getPotentialSuppliers:getPotentialSuppliers,
  getWatchers:getWatchers,
  getAssignee:getAssignee,
  getSupplier:getSupplier
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
