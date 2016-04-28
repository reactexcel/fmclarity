DocMessages = {
  register:registerCollection
}

var defaultHelpers = {
  getInboxName:getInboxName,
  getInboxId:getInboxId,
  getMessages:getMessages,
  getNotifications:getNotifications,
  getMessageCount:getMessageCount,
  markAllNotificationsAsRead:markAllNotificationsAsRead
}

function registerCollection(collection,customHelpers) {
  var helpers = _.extend({
    collectionName:collection._name
  },defaultHelpers,customHelpers);
  
  collection.helpers(helpers);
}

function getInboxId(){
  return {
    collectionName:this.collectionName,
    name:this.getInboxName(),
    path:this.path,
    query:{_id:this._id}
  }      
}

function getInboxName() {
  return this.getName()+"'s"+" inbox";
}

function getMessages(options) {
  options = options||{sort:{createdAt:1}};
  return Messages.find({inboxId:this.getInboxId()},options).fetch();
}

//why???
function getNotifications(options) {
  options = options||{sort:{createdAt:1}};
  return Messages.find({inboxId:this.getInboxId()},options).fetch();
}

function getMessageCount(opts) {
  return Messages.find({
    "inboxId.collectionName":this.collectionName,
    "inboxId.query._id":this._id
  },opts).count();
}

function getMessages(opts) {
  return Messages.find({
    "inboxId.collectionName":this.collectionName,
    "inboxId.query._id":this._id
  },opts).fetch();
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
  Meteor.call('User.markAllNotificationsAsRead',this.getInboxId());
}

