Issues = new Mongo.Collection('issues');


if (Meteor.isClient) {
  //Meteor.subscribe('books');

  //Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    //React.render(<App />, document.getElementById("render-target"));
  //});
}

if (Meteor.isServer) {
  Meteor.publish('issues', function () {
    return Issues.find();
  });
}

Meteor.methods({
  "Issue.save": function(item) {
    Issues.upsert(item._id, {$set: _.omit(item, '_id')});
  },
  "Issue.destroy":function(item) {
    Issues.remove(item._id);
  },
  "Issue.new":function(item) {
    newItem = _.extend({},item,{
      name:"New Work Order",
      description:"Enter description",
      status:"New",
      urgent:false,
      thumb:1,
      facility:{
        name:"2 Georges Rd (Building A)",
      },
      contact:{
        name:"John Smith",
        email:"johnny@flart.flart",
        phone:"0444-123-321",
        thumb:"a1.jpg"
      },
      supplier:{
        name:"XYY Contractors",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-1.png"
      },
    });
    Issues.insert(newItem);
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
    urgent:true,
    thumb:1,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a1.jpg"
    },
    supplier:{
      name:"XYY Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-1.png"
    },
  },
  {
    name:"Rust from ceiling fan",
    description:"Ceiling fan dropping rust. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"New",
    thumb:2,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a2.jpg"
    },
    supplier:{
      name:"XYY Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-2.png"
    },
  },
  {
    name:"Shocking doors",
    description:"Customers entering through sliding doors receiving electric shocks. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"New",
    urgent:true,
    thumb:3,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a3.jpg"
    },
    supplier:{
      name:"XYY Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-3.png"
    },
  },
  {
    name:"Barbed wire on floor",
    description:"Barbed wire in staff room a tripping hazard. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Open",
    thumb:4,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a4.jpg"
    },
    supplier:{
      name:"XYY Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-4.png"
    },
  },
  {
    name:"Live explosives",
    description:"Live mines in main car park.",
    status:"New",
    thumb:5,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a5.jpg"
    },
    supplier:{
      name:"XYY Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-1.png"
    },
  },
  {
    name:"Exploding fire extinguishers",
    description:"Fire extinguishers exploding at random intervals. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"New",
    thumb:1,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a6.jpg"
    },
    supplier:{
      name:"XYY Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-2.png"
    },
  },
  {
    name:"Cracked walls, level 7",
    description:"Large cracks appearing in walls on level 7. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Open",
    urgent:true,
    thumb:2,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a7.jpg"
    },
    supplier:{
      name:"Arvis A",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-3.png"
    },
  },
  {
    name:"Frayed elevator cabling",
    description:"Elevator cables fraying.",
    status:"Issued",
    thumb:3,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a8.jpg"
    },
    supplier:{
      name:"XYY Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-4.png"
    },
  },
  {
    name:"Nixious gas from AC",
    description:"Air conditioner producing noxious gas. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Open",
    thumb:4,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a1.jpg"
    },
    supplier:{
      name:"QQQ Maintenence",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-1.png"
    },
  },
  {
    name:"Non-ergonomic chairs",
    description:"Chairs on level 6 are not ergonomic. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Issued",
    thumb:5,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a2.jpg"
    },
    supplier:{
      name:"XYY Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-2.png"
    },
  },
  {
    name:"Intermittent muzak",
    description:"Elevator muzak intermittently cuts out. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"New",
    thumb:1,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a3.jpg"
    },
    supplier:{
      name:"XYY Suppliers",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-3.png"
    },
  },
  {
    name:"Coffee machine leaking",
    description:"Coffee machine producing putrid green liquid. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"New",
    thumb:2,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a4.jpg"
    },
    supplier:{
      name:"XYY Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-4.png"
    },
  },
  {
    name:"Sparks from light switches",
    description:"Sparks and smoke regularly emitted from light switches. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Closed",
    thumb:3,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a5.jpg"
    },
    supplier:{
      name:"ABC Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-1.png"
    },
  },
  {
    name:"Un-funny jokes",
    description:"Visitor mugs in staff room printed with un-funny joke. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    status:"Issued",
    thumb:4,
    facility:{
      name:"2 Georges Rd (Building A)",
    },
    contact:{
      name:"John Smith",
      email:"johnny@flart.flart",
      phone:"0444-123-321",
      thumb:"a6.jpg"
    },
    supplier:{
      name:"DEF Contractors",
      email:"xyz@abc.123",
      phone:"0400-123-123",
      thumb:"supplier-2.png"
    },
  }
];