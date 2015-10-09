Services = new Mongo.Collection('services');

if (Meteor.isClient) {
  //Meteor.subscribe('books');

  //Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    //React.render(<App />, document.getElementById("render-target"));
  //});
}

if (Meteor.isServer) {
  Meteor.publish('services', function () {
    return Services.find();
  });
}

Meteor.methods({
  "Service.save": function(item) {
    item.isNewItem = false;
    Services.upsert(item._id, {$set: _.omit(item, '_id')});
  },
  "Service.destroy":function(item) {
    Services.remove(item._id);
  },
  "Service.new":function(item) {
    newItem = _.extend({},item,{
      isNewItem:true,
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
      }
    });
    Services.insert(newItem);
  }
});

Services.helpers({
  save:function(){
    Meteor.call('Service.save',this);
  },
  destroy:function() {
    Meteor.call('Service.destroy',this);
  }
});

Services.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});

ExampleServices = [
	{
		name:"Mechanical",
		subservices:[
			{
				name:"Air Handling Plant"
			},
			{
				name:"Chillers"
			},
			{
				name:"Boilers"
			},
			{
				name:"Filters"
			},
			{
				name:"Controls"
			},
			{
				name:"Fire Dampers"
			},
			{
				name:"Smoke Spill Fans / Ventilation"
			},
			{
				name:"Other Mechanical Plant"
			},
			{
				name:"Generator"
			}
		]
	},
	{
		name:"Fire Protection",
		subservices:[
			{
				name:"Extinguisher Install"
			},
			{
				name:"Extinguisher Re-Fill"
			},
			{
				name:"Extinguisher Testing"
			},
			{
				name:"Automatic Sprinkler System"
			},
			{
				name:"Pumpsets"
			},
			{
				name:"Fire Detection & Alarm System"
			},
			{
				name:"EWIS"
			},
			{
				name:"Fire Doors"
			},
			{
				name:"Paths of Travel to Exits"
			},
			{
				name:"Exit Doors"
			},
			{
				name:"Passive Fire Systems"
			},
			{
				name:"Static Water Storage"
			},
			{
				name:"Smoke / Heat Vents"
			},
			{
				name:"Gaseous Suppression System"
			},
			{
				name:"Full Function Fire Test"
			}
		]
	},
	{
		name:"Electrical",
	},
	{
		name:"Water Treatment",
	},
	{
		name:"UPS",
	},
	{
		name:"Generator",
		subservices:[
			{
				name:"Flarty"
			}
		]
	},
	{
		name:"E&E Lighting",
		subservices:[
			{
				name:"Emergency lights"
			},
			{
				name:"Security lights"
			},
			{
				name:"Exit lights"
			},
			{
				name:"Light globes"
			}
		]
	},
	{
		name:"Lifts",
		subservices:[
			{
				name:"Not leveling"
			},
			{
				name:"Repair fittings"
			},
			{
				name:"Telephone inside car"
			},
			{
				name:"Elevator music"
			},
			{
				name:"Elevator stuck"
			}
		]
	},
	{
		name:"Egress",
	},
	{
		name:"ESM",
	}
];