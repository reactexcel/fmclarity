Issues = new Mongo.Collection('issues');

Meteor.methods({
  "Issue.save": function(item) {
    Issues.upsert(item._id, {$set: _.omit(item, '_id')});
  },
  "Issue.destroy":function(item) {
    Issues.remove(item._id);
  },
  "Issue.new":function(item) {
    newItem = _.extend({
      isNewItem:true,
      name:"",
      status:"New",
      thumb:1,
      contact:{
        name:"John Smith",
        email:"johnny@flart.flart",
        phone:"0444-123-321",
        thumb:"a1.jpg"
      }
    },item);
    Issues.insert(newItem);
  }
});

Issues.helpers({
  save:function(){
    Meteor.call('Issue.save',this);
  },
  destroy:function() {
    Meteor.call('Issue.destroy',this);
  },
  getFacility() {
    return Facilities.findOne(this._facility);
  },
  getContact() {
    return this.contact;
  },
  getCreator() {
    return Users.findOne(this._creator._id);
  },
  getContractor() {
    return Teams.findOne(this._contractor);
  }
});

Issues.before.insert(function (userId, doc) {
  if(!doc.createdAt) {
    doc.createdAt = moment().toDate();
  }
});
