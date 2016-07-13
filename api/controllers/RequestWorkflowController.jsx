// This file to be coupled with WOActionButtons and packaged

import {WorkflowHelper} from "meteor/fmc:workflow-helper";
import React from "react";

Issues.workflow = new WorkflowHelper(Issues);

Issues.workflow.addState('Draft',{
  create:{
    label:"Create",
    authentication:readyToOpen,
    method:actionOpen
  },
  cancel:{
    label:'Cancel',
    authentication:readyToCancel,
    method:actionCancel
  }
})

Issues.workflow.addState('New',{
  approve:{
    label:'Approve',
    authentication:readyToIssue,
    method:actionIssue
  },
  reject:{
    label:'Reject',
    authentication:readyToCancel,
    method:actionCancel
  }
})

Issues.workflow.addState('Issued',{
  accept:{
    label:"Accept",
    authentication:true,
    method:function(request,user) {
      Issues.update(request._id,{$set:{status:'In Progress'}});
    }
  },
  quote:{
    label:"Quote",
    authentication:true,
    method:function(request,user) {
      Issues.update(request._id,{$set:{status:'Quoted'}});
    }
  },
  //prob roll these three together
  reject:{
    label:'Reject',
    authentication:readyToCancel,
    method:actionCancel
  },
  delete:{
    label:'Delete',
    authentication:readyToDelete,
    method:actionDelete
  },
  reverse:{
    label:'Reverse',
    authentication:readyToReverse,
    method:actionReverse
  },
  //maybe just need to add once then next time close:"close"?
  close:{
    label:'Close',
    authentication:true,
    beforeMethod:actionStartClose,
    action:actionClose
  }
})

Issues.workflow.addState('In Progress',{
  close:{
    label:'Close',
    authentication:true,
    beforeMethod:actionStartClose,
    method:actionClose
  }
})


Issues.workflow.addState(['Cancelled','Deleted','Closed'],{
  reopen:{
    label:'Reopen',
    authentication:true,
    method:function(request) {
      Issues.update(request._id,{$set:{status:'New'}});
    }
  }
})

Issues.STATUS_DRAFT = "Draft";
Issues.STATUS_NEW = "New";
Issues.STATUS_ISSUED = "Issued";
Issues.STATUS_ASSIGNED = "Issued";
Issues.STATUS_CLOSING = "Closing";
Issues.STATUS_CLOSED = "Closed";
Issues.STATUS_REVIEWED = "Reviewed";
Issues.STATUS_CANCELLED = "Cancelled";
Issues.STATUS_DELETED = "Deleted";
Issues.STATUS_ARCHIVED = "Archived";

//maybe actions it better terminology?
Issues.methods({
  //this to auto-register
  getActions:{
    authentication:true,
    helper:function(request){
      return Issues.workflow.getActions(request)
    }
  },

  /*close:{
    method:actionClose,
    authentication:truefunction(role,user,request) {
      return (
        readyToClose(request)&&
        (
          AuthHelpers.managerOfRelatedTeam(role,user,request)||
          AuthHelpers.memberOfSuppliersTeam(role,user,request)
        )
      )
    }
  },
  reverse:{
    method:reverse,
    authentication:function(role,user,request) {
      return (
        request.exported&&request.status==Issues.STATUS_ISSUED&&
        AuthHelpers.managerOfRelatedTeam(role,user,request)
      )
    }
  },
  open:{
    authentication:function (role,user,request) {
      return (
        readyToOpen(request)&&
        AuthHelpers.memberOfRelatedTeam(role,user,request)
      )
    },
    method:actionOpen
  },
  issue:{
    method:issue,
    authentication:function (role,user,request) {
      return (
        readyToIssue(request)&&
        AuthHelpers.managerOfRelatedTeam(role,user,request)
      )
    }
  },
  startClosure:{
    method:startClosure,
    authentication:function(role,user,request) {
      return (
        request.status==Issues.STATUS_ISSUED&&
        (
          AuthHelpers.managerOfRelatedTeam(role,user,request)||
          AuthHelpers.memberOfSuppliersTeam(role,user,request)
        )
      )  
    }
  },
  close:{
    method:close,
    authentication:function(role,user,request) {
      return (
        readyToClose(request)&&
        (
          AuthHelpers.managerOfRelatedTeam(role,user,request)||
          AuthHelpers.memberOfSuppliersTeam(role,user,request)
        )
      )
    }
  },
  destroy:{
    method:actionDestroy,
    authentication:function(role,user,request) {
      return (
        readyToCancel(request)&&
        (role=="owner"||AuthHelpers.managerOfRelatedTeam(role,user,request))
      )
    }
  },
  cancel:{
    method:actionCancel,
    authentication:function(role,user,request) {
      return (
        readyToCancel(request)&&
        (role=="owner"||AuthHelpers.managerOfRelatedTeam(role,user,request))
      )
    }
  },
*/
})



/**
 *
 */
function readyToOpen(role,user,request) {
  return (
    request.name&&request.name.length&&
    //request.description&&request.description.length&&
    request.facility&&request.facility._id&&
    request.level&&request.level.name&&request.level.name.length&&
    request.service&&request.service.name.length
  )        
}

/**
 *
 */
function readyToIssue(role,user,request) {
  return (
    readyToOpen(role,user,request)&&
    request.supplier&&(request.supplier._id||request.supplier.name)
  )   
}

/**
 *
 */
function readyToClose(role,user,request) {
  return (
    request.closeDetails&&
    request.closeDetails.attendanceDate&&
    request.closeDetails.completionDate
  )  
}

/**
 *
 */
function readyToCancel(role,user,request) {
  return (
    request.status==Issues.STATUS_DRAFT||
    request.status==Issues.STATUS_NEW ||
    (request.status==Issues.STATUS_ISSUED&&!request.exported)
  )
}

function readyToDelete(role,user,request) {
  return (
    request.status==Issues.STATUS_DRAFT||
    request.status==Issues.STATUS_NEW ||
    (request.status==Issues.STATUS_ISSUED&&!request.exported)
  )
}

function readyToReverse(role,user,request) {
  return (
    request.status==Issues.STATUS_DRAFT||
    request.status==Issues.STATUS_NEW ||
    (request.status==Issues.STATUS_ISSUED&&!request.exported)
  )
}

function actionDestroy (request) {
  Issues.remove(request._id);
}

function actionCancel (request) {
  //starting to see a pretty consistent pattern here
  //perhaps there is a way to simplify this -  make it more readable
  //using this new workflow-helper????
  var response = Meteor.call('Issues.save',request,{status:Issues.STATUS_CANCELLED});
  request = Issues.findOne(response._id);
  request.distributeMessage({
    recipientRoles:["team","team manager","facility manager"],
    message:{
      verb:"cancelled",
      subject:"Work order #"+request.code+" has been cancelled",      
    }
  });
}

function actionDelete (request) {
  var response = Meteor.call('Issues.save',request,{status:Issues.STATUS_DELETED});
  request = Issues.findOne(response._id);
  request.distributeMessage({
    recipientRoles:["team","team manager","facility manager","supplier manager"],
    message:{
      verb:"deleted",
      subject:"Work order #"+request.code+" has been deleted",
    }
  });
  return request;  
}

function actionOpen (request) {
  var response = Meteor.call('Issues.save',request,{status:Issues.STATUS_NEW});
  request = Issues.findOne(response._id);
  request.distributeMessage({
    recipientRoles:["team","team manager","facility","facility manager"],
    message:{
      verb:"created",
      subject:"Work order #"+request.code+" has been created",
    }
  });
  return request;
}

function actionIssue(request) {
  var response = Meteor.call('Issues.save',request,{status:Issues.STATUS_ISSUED,issuedAt:new Date()});
  //request.updateStatus(Issues.STATUS_ISSUED,{issuedAt:new Date()})
  request = Issues.findOne(request._id);
  request.updateSupplierManagers();//could this be updateAllMembers???
  //why doesn't the above automatically refresh
  //why doesn't "save" automatically refresh?
  request = Issues.findOne(request._id);

  request.distributeMessage({
    recipientRoles:["owner","team","team manager","facility","facility manager"],
    message:{
      verb:"issued",
      subject:"Work order #"+request.code+" has been issued",
    }
  });

  var team = request.getTeam();
  request.distributeMessage({
    recipientRoles:["supplier manager"],
    suppressOriginalPost:true,
    message:{
      verb:"issued",
      subject:"New work request from "+" "+team.getName(),
      emailBody:function(recipient){
        var expiry = moment(request.dueDate).add({days:3}).toDate();
        var token = FMCLogin.generateLoginToken(recipient,expiry);
        return DocMessages.render(SupplierRequestEmailView,{recipient:{_id:recipient._id},item:{_id:request._id},token:token});
      }
    }
  });

  return request;
}

function actionStartClose(request) {

  request = Issues._transform(request);
  var now = new Date();

  request.closeDetails = {
    closeDetails:{
      attendanceDate:now,
      completionDate:now
    }
  }

  return {
    instructions:"All done ---",
    form:['closeDetails']
  }

/*return (<AutoForm 
            item={request} 
            form={['closeDetails']}
        >
            <h2>All done? Great! We just need a few details to finalise the job.</h2>
        </AutoForm>

  Modal.show({
    onSubmit:()=>{
      request.close();
    },
    content:
        <AutoForm 
            item={request} 
            form={['closeDetails']}
        >
            <h2>All done? Great! We just need a few details to finalise the job.</h2>
        </AutoForm>
  })

  return request;
*/  

}

function actionClose(request) {

  console.log({'closing':request});

  Meteor.call('Issues.save',request,{
    status:Issues.STATUS_CLOSED
  });

  request = Issues.findOne(request._id);

  if(request.closeDetails.furtherWorkRequired) {

    var closer = Meteor.user();

    var newRequest = {
      facility:request.facility,
      supplier:request.supplier,
      team:request.team,

      level:request.level,
      area:request.area,
      status:Issues.STATUS_NEW,
      service:request.service,
      subservice:request.subservice,
      name:"FOLLOW UP - "+request.name,
      description:request.closeDetails.furtherWorkDescription,
      priority:request.closeDetails.furtherPriority||'Scheduled',
      costThreshold:request.closeDetails.furtherQuoteValue
    };

    if(request.closeDetails.furtherQuote) {
      newRequest.attachments = [request.closeDetails.furtherQuote];
    }

    var response = Meteor.call('Issues.create',newRequest);
    var newRequest = Issues._transform(response);
    //ok cool - but why send notification and not distribute message?
    //is it because distribute message automatically goes to all recipients
    //I think this needs to be replaced with distribute message
    request.distributeMessage({message:{
      verb:"closed",
      subject:"Work order #"+request.code+" has been closed and a follow up has been requested"
    }});

    newRequest.sendNotification({
      verb:"requested a follow up to "+request.getName(),
      subject:closer.getName()+" requested a follow up to "+request.getName(),
      body:newRequest.description
    });
  }
  else {

    request.distributeMessage({message:{
      verb:"closed",
      subject:"Work order #"+request.code+" has been closed"
    }});

  }

  if(request.closeDetails.attachments) {
    request.closeDetails.attachments.map(function(a){
      request.attachments.push(a);
      request.save();
    });
  }

  return request;
}

function actionReverse(request) {
  //save current request
  Meteor.call('Issues.save',request,{
    status:Issues.STATUS_CLOSED,
    priority:"Closed",
    name:"Reversed - "+request.name,
    reversed:true
  });

  //create new request
  var newRequest = _.omit(request,'_id');
  _.extend(newRequest,{
    status:"Reversed",
    code:'R'+request.code,
    exported:false,
    costThreshold:request.costThreshold*-1,
    name:"Reversal - "+request.name
  });
  var response = Meteor.call('Issues.create',newRequest);
  //distribute message on new request
  request = Issues.findOne(request._id);
  request.distributeMessage({
    recipientRoles:["team","team manager","facility manager","supplier manager"],
    message:{
      verb:"requested",
      subject:"Work order #"+request.code+" has been reversed and reversal #"+newRequest.code+" has been created"              
    }
  });
  return newRequest; //perhaps we should just be passing around ids?
}