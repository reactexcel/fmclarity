Contacts = new Mongo.Collection('contacts');


if (Meteor.isClient) {
  //Meteor.subscribe('books');

  //Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    //React.render(<App />, document.getElementById("render-target"));
  //});
}

if (Meteor.isServer) {
  Meteor.publish('contacts', function () {
    return Contacts.find();
  });
}

Meteor.methods({
  "Contact.save": function(item) {
    item.isNewItem = false;
    Contacts.upsert(item._id, {$set: _.omit(item, '_id')});
  },
  "Contact.destroy":function(item) {
    Contacts.remove(item._id);
  },
  "Contact.new":function(item) {
    newItem = _.extend({},item,{
      name:"XYY Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-1.png"
    });
    Contacts.insert(newItem);
  }
});

Contacts.helpers({
  save:function(){
    Meteor.call('Contact.save',this);
  },
  destroy:function() {
    Meteor.call('Contact.destroy',this);
  }
});

Contacts.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});

ExampleContacts = [
  {
    name:"Normal Contractors",
    email:"xyz@abc.123",
    phone:"0400-123-123",
    thumb:"supplier-1.png",
    services:["Mechanical","Fire Prevention","Electrical"]
  },
  {
    name:"Harrison Services",
    email:"xyz@abc.123",
    phone:"0400-123-123",
    thumb:"supplier-2.png",
    services:["UPS"]
  },
  {
    name:"Rovo",
    email:"xyz@abc.123",
    phone:"0400-123-123",
    thumb:"supplier-3.png",
    services:["Mechanical","Fire Prevention","Electrical"]
  },
  {
    name:"Shotnick",
    email:"xyz@abc.123",
    phone:"0400-123-123",
    thumb:"supplier-4.png",
    services:["Lifts","Fire Prevention","Electrical","Water Treatment"]
  },
  {
    name:"ABC Contractors",
    email:"xyz@abc.123",
    phone:"0400-123-123",
    thumb:"supplier-5.png",
    services:["UPS","Fire Prevention","Egress"]
  },
  {
    name:"DEF Contractors",
    email:"xyz@abc.123",
    phone:"0400-123-123",
    thumb:"supplier-6.png",
    services:["Generator","E&E Lighting","Water Treatment"]
  }
];