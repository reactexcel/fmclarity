Discussions = FM.createCollection('Discussions',{
  name:{
  	type:String
  },
  description:{
  	type:String
  },
  watchers:{
    type:[Object],
    defaultValue:[]
  },
  posts:{
    type:[Object],
    defaultValue:[] 
  }
});

if(Meteor.isServer) {
  Meteor.publish("discussions",function(){
    return Discussions.find();
  });
}
else {
  Meteor.subscribe("discussions");
}