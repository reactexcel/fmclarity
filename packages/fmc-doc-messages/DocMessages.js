Messages = ORM.Collection("Messages");


DocMessages = {
  register:registerCollection,
  isValidEmail:isValidEmail,
  config:getConfigurationFunction
}

var defaultHelpers = {
  sendMessage:sendMessageToSelfAndWatchers,
  distributeMessage:distributeMessage,
  sendNotification:sendMessageToSelfAndWatchers,
  markAllNotificationsAsRead:markAllNotificationsAsRead,
  getInboxName:getInboxName,
  getInboxId:getInboxId,
  getNotifications:getNotifications,
  getMessageCount:getMessageCount,
  getRecipients:getRecipients,
}

function isValidEmail(email) {
  var temp = email.split('@');
  var name = temp[0];
  var server = temp[1];
  //return ucfirst name
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getConfigurationFunction(options) {
  return function(collection) {
      registerCollection(collection,options);
  }
}

function registerCollection(collection,opts) {
  opts = opts||{};
  var authentication = opts.authentication||true;
  var customHelpers = opts.helpers||{};

  var helpers = _.extend({
    collectionName:collection._name
  },defaultHelpers,customHelpers);

  collection.helpers(helpers);

  collection.actions({
    getMessages:{
      authentication:authentication,
      helper:function(inbox,options) {
        options = options||{sort:{createdAt:1}};
        return Messages.find({
          "inboxId.collectionName":inbox.collectionName,
          "inboxId.query._id":inbox._id,
        },options).fetch();
      }
    }
  })
}

//gets all recipients of the message
function getRecipients(inCC,outCC) {
  outCC = outCC||[];
  inCC.map(function(c){
    if(c) {
      outCC.push(c);
      if(c.getWatchers) {
        getRecipients(c.getWatchers(),outCC);
      }
    }
  })
  return outCC;
}

//if the recipient structure contains Teams their members are also added to the structure
function flattenRecipients(cc) {
  var recipients = getRecipients(cc);
  recipients = _.uniq(recipients,false,function(i){
    return i._id;
  })
  return recipients;  
}

function distributeMessage(message,recipientRoles,options) {
  options = options||{};
  var user = Meteor.user();
  var obj = this;
  message.target = obj.getInboxId();
  message.owner = {
    _id:user._id,
    name:user.getName()
  }
  //add message/notification to original sending object
  if(!options.suppressOriginalPost) {
    sendMessage(message,obj);
  }
  //scan through the list of recipientRoles and process them
  // if string treat as role name, is obj treat as recipient proper
  //console.log(recipientRoles);
  var recipients = getRecipientListFromRoles(obj,recipientRoles);
  recipients = _.uniq(recipients,false,function(i){
    return i._id;
  })

  recipients.map(function(r){
    console.log({"sending notification to":r.getName()});
    sendMessage(message,r);
  })
}

function getRecipientListFromRoles(obj,roles) {
  var recipients = [];
  roles.map(function(role){
    if(role=="team"&&obj.getTeam) {
      team = obj.getTeam();
      if(team) {
        recipients.push(team);
      }
    }
    //else if we are sending it to facility
    else if(role=="facility"&&obj.getFacility) {
      facility = obj.getFacility();
      if(facility) {
        recipients.push(facility);
      }
    }
    //else if we are sending it to the member with "role"
    else if(obj.getMembers) {
      recipients = recipients.concat(obj.getMembers({role:role}))
    }
  })
  return recipients;
}

function sendMessageToMembers(obj,message,role) {
  var team,facility,recipients = [];
  //if we are sending the message to the team
  if(role=="team"&&obj.getTeam) {
    team = obj.getTeam();
    if(team) {
      recipients.push(team);
    }
  }
  //else if we are sending it to facility
  else if(role=="facility"&&obj.getFacility) {
    facility = obj.getFacility();
    if(facility) {
      recipients.push(facility);
    }
  }
  //else if we are sending it to the member with "role"
  else if(obj.getMembers) {
    recipients = obj.getMembers({role:role})
  }
  recipients.map(function(r){
    //console.log(r);
    sendMessage(message,r);
  })
}

function sendMessageToSelfAndWatchers(message,cc) {
  cc = cc||this.getWatchers();
  cc = flattenRecipients(cc);

  var user = Meteor.user();
  message.target = this.getInboxId();
  message.owner = {
    _id:user._id,
    name:user.getName()
  }

  sendMessage(message,this);

  cc.map(function(recipient){
    sendMessage(message,recipient);
  })
}

function recipientIsCreator(message,recipient) {
  return recipient._id&&message.owner._id&&recipient._id==message.owner._id
}

function sendMessage(message,recipient) {
  var msgCopy, emailBody;

  //if emailBody is a callback then create the personalised body using the callback
  if(Meteor.isServer&&message.emailBody&&_.isFunction(message.emailBody)) {
    emailBody = message.emailBody(recipient,message);
  }
  else {
    emailBody = message.emailBody;
  }

  //make copy of original message using our own personal inboxId
  var msgCopy = _.extend({},message,{
    inboxId:recipient.getInboxId(),
    emailBody:emailBody
  });


  //check if we should mark the message as read
  if(recipientIsCreator(message,recipient)){
    msgCopy.read = true;
  }

  //create the message
  Meteor.call("Messages.create",msgCopy,function(){
    //then email if we are supposed to
    if(!msgCopy.read) {
      Meteor.call("Messages.sendEmail",recipient,msgCopy);
    }
  });
}

// I reckon trash getInboxName and make getInboxId explicit in each class that uses it
function getInboxId(){
  return {
    collectionName:this.collectionName,
    query:{_id:this._id},
    name:this.getInboxName(),
    path:this.path,
  }      
}

// I reckon trash getInboxName and make getInboxId explicit in each class that uses it
function getInboxName() {
  return this.getName()+"'s"+" inbox";
}

function getMessageCount(opts) {
  return Messages.find({
    "inboxId.collectionName":this.collectionName,
    "inboxId.query._id":this._id
  },opts).count();
}

function getNotifications(opts) {
  var hideOwn = opts?opts.hideOwn:false;
  var q = {
    "inboxId.collectionName":this.collectionName,
    "inboxId.query._id":this._id,
    read:false
  };
  //console.log(q);
  if(hideOwn) {
    q["$ne"] = {"owner._id":this._id};
  }
  return Messages.find(q,{sort:{createdAt:-1}}).fetch();
}
 
function markAllNotificationsAsRead() {
  Meteor.call('Messages.markAllNotificationsAsRead',this.getInboxId());
}