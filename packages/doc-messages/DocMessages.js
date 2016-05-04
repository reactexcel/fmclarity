Messages = ORM.Collection("Messages");

DocMessages = {
  register:registerCollection
}

var defaultHelpers = {
  sendMessage:sendMessage,
  sendNotification:sendMessage,
  markAllNotificationsAsRead:markAllNotificationsAsRead,
  getInboxName:getInboxName,
  getInboxId:getInboxId,
  getMessages:getMessages,
  getNotifications:getNotifications,
  getMessageCount:getMessageCount,
}

function sendMessage(message,cc,opts) {
  cc = cc||this.getWatchers();
  var user = Meteor.user();

  message.inboxId = this.getInboxId();

  //only create target and owner first time
  if(message.originalId) {
    var alreadySent = Messages.findOne({
      inboxId:message.inboxId,
      originalId:message.originalId
    });
    if(alreadySent) {
      return;
    }
  }
  else {
    //if this is the first instance
    message.target = message.inboxId;
    message.owner = {
      _id:user._id,
      name:user.getName()
    }    
  }

  Meteor.call("Messages.create",message,function(err,messageId){
    message.originalId = message.originalId||messageId;
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
  if(hideOwn) {
    q["$ne"] = {"owner._id":this._id};
  }
  return Messages.find(q,{sort:{createdAt:-1}}).fetch();
}
 
function markAllNotificationsAsRead() {
  Meteor.call('Messages.markAllNotificationsAsRead',this.getInboxId());
}

function sendUserEmail(message,opts) {
  var doNotEmail = opts?opts.doNotEmail:false;
  message.inboxId = this.getInboxId();
  if(message.originalId) {
    var alreadySent = Messages.findOne({
      inboxId:message.inboxId,
      originalId:message.originalId
    });
    if(alreadySent) {
      return;
    }
  }
  if(this._id&&message.owner._id&&this._id==message.owner._id) {
    message = _.extend({},message,{read:true});
  }
  Meteor.call("Messages.create",message);
  if(!message.read&&!doNotEmail) {
    Meteor.call("Messages.sendEmail",this,message);
  }
}


registerCollection(Meteor.users,{
  sendMessage:sendUserEmail
});
