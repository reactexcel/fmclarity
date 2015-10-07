Facilities = new Mongo.Collection('facilities');


if (Meteor.isClient) {
  //Meteor.subscribe('books');

  //Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    //React.render(<App />, document.getElementById("render-target"));
  //});
}

if (Meteor.isServer) {
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('facilities', function () {
    return Facilities.find();
  });
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

Facilities.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});

/*
Schemas = {};
Schemas.Books = new SimpleSchema({
    address: {
        type: String,
        label: "Address",
        max: 200
    },
    field2: {
        type: String,
        label: "Field 2"
    },
    field3: {
        type: Number,
        label: "Field 3",
        min: 0
    },
    field4: {
        type: Date,
        label: "Field 4",
        optional: true
    },
    summary: {
        type: String,
        label: "Summary",
        optional: true,
        max: 1000
    }
});

Books.attachSchema(Schemas.Books);

Books.helpers({

});
*/




ExampleFacilities = [
	{
		name:"2 Georges Rd (Building A)",
		address:"2 Georges Rd",
		location: "Building A",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:1,
		type:"Office",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"2 Georges Rd (Building B)",
		address:"2 Georges Rd",
		location: "Building B",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:1,
		type:"Office",
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
		thumb:2,
		type:"Office",
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
		thumb:1,
		type:"Office",
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
		thumb:1,
		type:"Office",
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
		thumb:1,
		type:"Office",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Franklin Scholar, Launceston",
		address:"12 Warwick St, Hobart, TAS",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:1,
		type:"Office",
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
		thumb:3,
		type:"Office",
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
		thumb:4,
		type:"Office",
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
		thumb:1,
		type:"Office",
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
		thumb:1,
		type:"Office",
		contact:{
			name:"Johnny Smithy",
			thumb:"a1.jpg",
			email:"js@email.com",
			phone:"0414-111-111"
		}
	}
];