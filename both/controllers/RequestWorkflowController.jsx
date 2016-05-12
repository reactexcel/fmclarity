
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// This file to be coupled with WOActionButtons and packaged

Issues.STATUS_DRAFT = "Draft";
Issues.STATUS_NEW = "New";
Issues.STATUS_ISSUED = "Issued";
Issues.STATUS_ASSIGNED = "Issued";
Issues.STATUS_CLOSING = "Closing";
Issues.STATUS_CLOSED = "Closed";
Issues.STATUS_REVIEWED = "Reviewed";
Issues.STATUS_ARCHIVED = "Archived";

//maybe actions it better terminology?
Issues.methods({
  create:{
    authentication:true,//AuthHelpers.all
    method:RBAC.lib.create.bind(Issues),
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
  save:{
    authentication:true,
    method:RBAC.lib.save.bind(Issues)
  },
  destroy:{
    method:RBAC.lib.destroy.bind(Issues),
    authentication:function(role,user,request) {
      return (
        readyToCancel(request)&&
        (role=="owner"||AuthHelpers.managerOfRelatedTeam(role,user,request))
      )
    }
  },
})



/**
 *
 */
function readyToOpen(request) {
  return (
    request.status==Issues.STATUS_DRAFT&&
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
function readyToIssue(request) {
  return (
    (request.status==Issues.STATUS_NEW||readyToOpen(request))&&
    request.supplier&&(request.supplier._id||request.supplier.name)
  )   
}

/**
 *
 */
function readyToClose(request) {
  return (
    request.status==Issues.STATUS_ISSUED&&
    request.closeDetails&&
    request.closeDetails.attendanceDate&&
    request.closeDetails.completionDate
  )  
}

/**
 *
 */
function readyToCancel(request) {
  return (
    request.status==Issues.STATUS_DRAFT||
    request.status==Issues.STATUS_NEW ||
    (request.status==Issues.STATUS_ISSUED&&!request.exported)
  )
}

/**
 *
 */
function actionOpen (request) {
  var response = Meteor.call('Issues.save',request,{status:Issues.STATUS_NEW});

  var request = Issues.findOne(response._id);
  var watchers = request.getWatchers();
  watchers[2] = null;

  request.sendNotification({
    verb:"created",
    subject:"Work order #"+request.code+" has been created",
  },watchers);//might also call sendMessage depending on state of notification options

  return Issues.findOne(response._id);
}


/**
 *
 */
function generalRequestNotification(verb) {
	return function(request) {
		request.sendNotification({
			verb:verb,
			subject:"Work order #"+request.code+" has been "+verb
		})
	}
}

/**
 *
 */
function issue(request) {

  var response = Meteor.call('Issues.save',request,{
    status:Issues.STATUS_ISSUED,
    issuedAt:new Date()
  });
  var request = Issues.findOne(response._id);
  var watchers = request.getWatchers();
  watchers[2] = null;

  request.sendNotification({
    verb:"issued",
    subject:"Work order #"+request.code+" has been issued",
  },watchers);//might also call sendMessage depending on state of notification options

  //var supplier = request.getSupplier();
  //a parellel functionality to sendNotification
  //EmailTemplates.supplierIssued(request) is a function which returns a function which
  //  takes a user as an argument and is mapped to watchers
  //supplier.sendMessage(EmailTemplates.supplierIssued(request));

  sendSupplierEmail(request);

  return request;
}

//should this just be a standard message sent using "sendMessage"?
function sendSupplierEmail(request){

  var tester = Meteor.user();
  if(Meteor.isServer/*&&FM.inProduction()*/) { Meteor.defer(function(){

    request = Issues._transform(request);
    var team = request.getTeam();
    var supplier = request.getSupplier();
    var members = supplier.getMembers({role:"manager"});
    /*for(var i in members) {
      console.log(members[i].emails[0].address);
    }*/
    var user = members[0];    
    if(user) {
      var email = user.profile.email;//user.emails[0].address;
      var to = user.name?(user.name+" <"+email+">"):email;

      //var stampedLoginToken = Accounts._generateStampedLoginToken();
      //Accounts._insertLoginToken(user._id, stampedLoginToken);
      var expiry = moment(request.dueDate).add({days:3}).toDate();
      var token = FMCLogin.generateLoginToken(user,expiry);
      var element = React.createElement(SupplierRequestEmailView,{item:{_id:request._id},token:token});
      var subject = "New work request from "+" "+team.getName();
      var html = ReactDOMServer.renderToStaticMarkup(element);

      var email, devMsg;

      devMsg = {
        to:["leo@fmclarity.com","rich@fmclarity.com"]
      }

      if(FM.inProduction()) {

        email = {
          to:to,
          from:"FM Clarity <no-reply@fmclarity.com>",
          subject:subject,
          html:html
        }
        Email.send(email);

        devMsg.from = "FM Outgoing Message Alert <no-reply@fmclarity.com>";
        devMsg.subject = "["+to+"]"+subject;
        devMsg.html = 
          "***Message sent to '"+to+"'***<br/><br/>"+
          html+
            "<br/>******<br/>"+
            JSON.stringify(request);
      }
      else {
        devMsg.from = "FM Test Message <no-reply@fmclarity.com>";
        devMsg.subject = "["+to+"]"+subject;
        devMsg.html = 
          "***Intercepted message to "+to+"***<br/><br/>"+
          html+
            "<br/>******<br/>"+
            JSON.stringify(request);
      }

      Email.send(devMsg);      

    }
  })}  
}

/**
 *
 */
function startClosure(issue) {
  var now = new Date();
  var response = Meteor.call('Issues.save',issue,{
    closeDetails:{
      attendanceDate:now,
      completionDate:now
    }
  })
  response.status = Issues.STATUS_CLOSING;
  return response;
}

/**
 *
 */
function close(issue) {

  var response = Meteor.call('Issues.save',issue,{
    status:Issues.STATUS_CLOSED,
    priority:"Closed"
  });

  issue  = Issues.findOne(response._id);

  if(issue.closeDetails.furtherWorkRequired) {

    var closer = Meteor.user();

    var newIssue = {
      facility:issue.facility,
      supplier:issue.supplier,
      team:issue.team,

      level:issue.level,
      area:issue.area,
      status:Issues.STATUS_NEW,
      service:issue.service,
      subservice:issue.subservice,
      name:"FOLLOW UP - "+issue.name,
      description:issue.closeDetails.furtherWorkDescription,
      priority:issue.closeDetails.furtherPriority||'Scheduled',
      costThreshold:issue.closeDetails.furtherQuoteValue
    };

    if(issue.closeDetails.furtherQuote) {
      newIssue.attachments = [issue.closeDetails.furtherQuote];
    }

    var response = Meteor.call('Issues.create',newIssue);
    var newIssue = Issues._transform(response);

    issue.sendNotification({
      verb:"closed",
      subject:"Work order #"+issue.code+" has been closed and a follow up has been requested"
    });

    newIssue.sendNotification({
      verb:"requested a follow up to "+issue.getName(),
      subject:closer.getName()+" requested a follow up to "+issue.getName(),
      body:newIssue.description
    });
  }
  else {

    issue.sendNotification({
      verb:"closed",
      subject:"Work order #"+issue.code+" has been closed"
    });

  }

  if(issue.closeDetails.attachments) {
    issue.closeDetails.attachments.map(function(a){
      issue.attachments.push(a);
      issue.save();
    });
  }

  return issue;
}

/**
 *
 */
function reverse(request) {
  //a check to see if it already has helpers?

  Meteor.call('Issues.save',request,{
    status:Issues.STATUS_CLOSED,
    priority:"Closed",
    name:"Reversed - "+request.name,
    reversed:true
  });

  var newRequest = _.omit(request,'_id');
  _.extend(newRequest,{
    status:"Reversed",
    code:'R'+request.code,
    exported:false,
    costThreshold:request.costThreshold*-1,
    name:"Reversal - "+request.name
  });

  var response = Meteor.call('Issues.create',newRequest);

  request = Issues.findOne(request._id);
  request.sendNotification({
    verb:"requested",
    subject:"Work order #"+request.code+" has been reversed and reversal #"+newRequest.code+" has been created"    
  });

  //perhaps we should just be passing around ids?
  return newRequest;
}