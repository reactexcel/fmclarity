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
  getContractor() {
    return Teams.findOne(this._contractor);
  }
});

Issues.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});




ExampleIssues = [
  {
    name:"Toilet won't flush",
    description:"Toilet won't flush. Brown liquid leaking onto floor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    status:"New",
    thumb:1,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a1.jpg"
    }
  },
  {
    name:"Rust from ceiling fan",
    description:"Ceiling fan dropping rust. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"New",
    thumb:2,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a2.jpg"
    }
  },
  {
    name:"Shocking doors",
    description:"Customers entering through sliding doors receiving electric shocks. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"New",
    thumb:3,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a3.jpg"
    }
  },
  {
    name:"Barbed wire on floor",
    description:"Barbed wire in staff room a tripping hazard. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Issued",
    thumb:4,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a4.jpg"
    }
  },
  {
    name:"Live explosives",
    description:"Live mines in main car park.",
    status:"New",
    thumb:5,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a5.jpg"
    }
  },
  {
    name:"Exploding fire extinguishers",
    description:"Fire extinguishers exploding at random intervals. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"New",
    thumb:1,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a6.jpg"
    }
  },
  {
    name:"Cracked walls, level 7",
    description:"Large cracks appearing in walls on level 7. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Issued",
    thumb:2,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a7.jpg"
    }
  },
  {
    name:"Frayed elevator cabling",
    description:"Elevator cables fraying.",
    status:"Issued",
    thumb:3,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a8.jpg"
    }
  },
  {
    name:"Nixious gas from AC",
    description:"Air conditioner producing noxious gas. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Issued",
    thumb:4,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a1.jpg"
    }
  },
  {
    name:"Non-ergonomic chairs",
    description:"Chairs on level 6 are not ergonomic. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Issued",
    thumb:5,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a2.jpg"
    }
  },
  {
    name:"Intermittent muzak",
    description:"Elevator muzak intermittently cuts out. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"New",
    thumb:1,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a3.jpg"
    }
  },
  {
    name:"Coffee machine leaking",
    description:"Coffee machine producing putrid green liquid. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"New",
    thumb:2,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a4.jpg"
    }
  },
  {
    name:"Sparks from light switches",
    description:"Sparks and smoke regularly emitted from light switches. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Closed",
    thumb:3,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a5.jpg"
    }
  },
  {
    name:"Un-funny jokes",
    description:"Visitor mugs in staff room printed with un-funny joke. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Issued",
    thumb:4,
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a6.jpg"
    }
  }
];