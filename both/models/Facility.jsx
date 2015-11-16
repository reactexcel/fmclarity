Facilities = new Mongo.Collection('facilities');

Schema.Facility = new SimpleSchema({
    name: {
      type: String,
      label: "Name"
    },
    _team: {
    	type: Object,
    	label: "Team query object",
    	optional:true
    },
    "_team._id": {
    	type:String,
    	label:"Team id"
    },
    contact: {
    	type: Object,
    	label : "Contact details",
    	optional:true
    },
    "contact.name": {
    	type:String,
    	label:"Contact name",
    },
    "contact.thumb": {
    	type:String,
    	label:"Contact thumbnail file",
    },
    "contact.email": {
    	type:String,
    	label:"Contact email",
    },
    "contact.phone": {
    	type:String,
    	label:"Contact phone",
    },
    address: {
      type: String,
      label: "Address"
    },
    location: {
      type: String,
      label: "Location",
      optional:true
    },
    addressLine1 :{
      type: String,
      label: "Address line 2",
      optional:true
    },
    addressLine2 :{
      type: String,
      label: "Address line 2",
      optional:true
    },
    city :{
      type: String,
      label: "City/Suburb",
      optional:true
    },
    state :{
      type: String,
      label: "State",
      optional:true
    },
    country :{
      type: String,
      label: "Country",
      optional:true
    },
    postcode :{
      type: String,
      label: "Postcode/ZIP",
      optional:true
    },
    description: {
      type: String,
      label: "Description",
      optional:true
    },
    thumb: {
    	type:String,
    	label:"Thumbnail file",
    	optional:true
    },
    buildingAreas: {
    	type:String,
    	label:"Areas",
    	optional:true
    },
    buildingServices: {
    	type:String,
    	label:"Services",
    	optional:true
    }
});

Facilities.attachSchema(Schema.Facility);

if (Meteor.isClient) {
  //Meteor.subscribe('books');

  //Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    //React.render(<App />, document.getElementById("render-target"));
  //});
}

Meteor.methods({
	"Facility.save": function(item) {
		item.isNewItem = false;
		Facilities.upsert(item._id, {$set: _.omit(item, '_id')});
	},
 	"Facility.destroy":function(item) {
		Facilities.remove(item._id);
	},
	"Facility.new":function(item) {
		newItem = _.extend({},item,{
			name:"Enter facility name",
			isNewItem:true,
			address:"Enter facility address",
			location: "Enter facility location",
			description:"Enter facility description",
			thumb:1,
			type:"Office",
			contact:{
				name:"John Smith",
				thumb:"a1.jpg",
				email:"johnny@big.net",
				phone:"0444-123-321"
			}
		});
		Facilities.insert(newItem);
	}
})

Facilities.helpers({
  save:function(){
    Meteor.call('Facility.save',this);
  },
  destroy:function() {
    Meteor.call('Facility.destroy',this);
  },
  getIssues() {
  	return Issues.find({"_facility._id":this._id}).fetch();
  },
  getTeam() {
  	return Teams.findOne(this._team);
  },
  getIssueCount() {
  	return Issues.find({"_facility._id":this._id}).count();
  }
});

// this can go in startup - right?
Facilities.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});

ExampleFacilities = [
	{
		name:"Georges Rd (Building A)",
		address:"2 Georges Rd",
		location: "Building A",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Georges Rd (Building B)",
		address:"2 Georges Rd",
		location: "Building B",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Head Office",
		address:"4/45 Clarence Street, Sydney",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-2.jpg",
		contact:{
			name:"Pamela Jones",
			thumb:"a1.jpg",
			email:"pj@notmail.net",
			phone:"0434-143-324"
		}
	},
	{
		name:"Franklin Scholar, Osbourne Park",
		address:"1/76 Hasler Rd, Osbourne Park, WA",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Franklin Scholar, Cantebury",
		address:"21 Shierlaw Ave, Canterbury, VIC",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Franklin Scholar, Launceston",
		address:"65 Cameron ST, Launceston, TAS",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Franklin Scholar, Hobart",
		address:"12 Warwick St, Hobart, TAS",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Professional & International English - Adelaide",
		address:"22 Peel St, Adelaide",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-3.jpg",
		contact:{
			name:"Neelix Ralph",
			thumb:"a1.jpg",
			email:"nralph@email.com",
			phone:"0423-333-313"
		}
	},
	{
		name:"Professional & International English - Brisbane",
		address:"252 St Pauls Terrace, Spring Hill",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-4.jpg",
		contact:{
			name:"Harry Arogula",
			thumb:"a1.jpg",
			email:"haro@memail.com",
			phone:"0444-444-324"
		}
	},
	{
		name:"Professional & International English - Cairns",
		address:"130 McLeod St",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"Gary Hardman",
			thumb:"a1.jpg",
			email:"hardman@email.com",
			phone:"0414-111-111"
		}
	},
	{
		name:"Bradford College",
		address:"132 Grenfell St, Adelaide",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"Johnny Smithy",
			thumb:"a1.jpg",
			email:"js@email.com",
			phone:"0414-111-111"
		}
	}
];