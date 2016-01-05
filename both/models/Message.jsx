Messages = FM.createCollection('Message',{
  name:{
    type:String,
  },
  subject:{
    type:String,
  },
  body:{
    type:String,
  },
  recipient:{
    type:Object,
  },
  allRecipients:{
    type:[Object],
    defaultValue:[]
  },
  read:{
    type:Boolean,
    defaultValue:false
  },
  sticky:{
    type:Boolean,
    defaultValue:false    
  }
});

if(Meteor.isServer) {
  Meteor.publish("messages",function(){
    return Messages.find();
  });
}
else {
  Meteor.subscribe("messages");
}