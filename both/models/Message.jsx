Messages = FM.createCollection('Message',{
  name:{
    type:String,
    input:"mdtext",
    label:"Title"
  },
  text:{
    type:String,
    input:"textarea",
    label:"Message",
  },
  rating:{
    type:Number,
    input:"vote",
    label:"Rating"
  },
  _recipient:{
    type:Object,
    input:"contact",
    label:"Recipient"
  },

});

if(Meteor.isServer) {
  Meteor.publish("messages",function(){
    return Messages.find();
  })
}
else {
  Meteor.subscribe("messages");
}