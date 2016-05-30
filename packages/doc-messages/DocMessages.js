Messages = ORM.Collection("Messages");


DocMessages = {
  register:registerCollection
}

var defaultHelpers = {
  sendMessage:sendMessageToSelfAndWatchers,
  distributeMessage:distributeMessage,
  sendNotification:sendMessageToSelfAndWatchers,
  markAllNotificationsAsRead:markAllNotificationsAsRead,
  getInboxName:getInboxName,
  getInboxId:getInboxId,
  getMessages:getMessages,
  getNotifications:getNotifications,
  getMessageCount:getMessageCount,
  getRecipients:getRecipients,
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

function sendMessageToMembers(obj,message,role) {
  var team,facility,recipients = [];
  if(role=="team"&&obj.getTeam) {
    team = obj.getTeam();
    if(team) {
      recipients.push(team);
    }
  }
  else if(role=="facility"&&obj.getFacility) {
    facility = obj.getFacility();
    if(facility) {
      recipients.push(facility);
    }
  }
  else if(obj.getMembers) {
    recipients = obj.getMembers({role:role})
  }
  //console.log(recipients);
  recipients.map(function(r){
    //console.log(r);
    sendMessage(message,r);
  })
}

function distributeMessage(message,recipientRoles) {
  var user = Meteor.user();
  var obj = this;
  message.target = obj.getInboxId();
  message.owner = {
    _id:user._id,
    name:user.getName()
  }
  //add message/notification to original sending object
  sendMessage(message,obj);
  //scan through the list of recipientRoles and process them
  // if string treat as role name, is obj treat as recipient proper
  //console.log(recipientRoles);
  recipientRoles.map(function(role){
    sendMessageToMembers(obj,message,role);
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
  //make copy of original message using our own personal inboxId
  var copy = _.extend({},message,{
    inboxId:recipient.getInboxId()
  });

  //check if we should mark the message as read
  if(recipientIsCreator(message,recipient)){
    copy.read = true;
  }

  //create the message
  Meteor.call("Messages.create",copy,function(){
    //then email if we are supposed to
    if(!copy.read) {
      Meteor.call("Messages.sendEmail",recipient,copy);
    }
  });

}

function registerCollection(collection,customHelpers) {
  var helpers = _.extend({
    collectionName:collection._name
  },defaultHelpers,customHelpers);
  
  collection.helpers(helpers);
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

function getMessages(options) {
  options = options||{sort:{createdAt:1}};
  return Messages.find({
    "inboxId.collectionName":this.collectionName,
    "inboxId.query._id":this._id,
  },options).fetch();
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