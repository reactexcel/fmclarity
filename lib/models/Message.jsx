PostSchema = {
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
  },
  rating:{
    type:Number,
    input:"vote",
    label:"Rating"
  },
  commments:{
    type:[Object],
    defaultValue:[]
  }
}

ORM.attachSchema(Posts,PostSchema);

Posts.helpers({
  getInbox() {
    var inboxId = this.inboxId;
    var collection = FM.collections[inboxId.collectionName];
    return collection.findOne(inboxId.query);
  },
  getTargetName() {
    var target = this.target?this.target:this.inboxId;
    return target.name;
  },
  getTargetUrl() {
    var target = this.target?this.target:this.inboxId;
    //console.log(target);
    //return FlowRouter.path(target.path,target.query);
    if(target.path) {
      //return '/'+target.path+'/'+target.query._id;
      return Meteor.absoluteUrl(target.path+'/'+target.query._id);
    }
  },
  getAbsoluteTargetUrl() {
    var target = this.target?this.target:this.inboxId;
    //console.log(target);
    //return FlowRouter.path(target.path,target.query);
    if(target.path) {
      return Meteor.absoluteUrl(target.path+'/'+target.query._id);
    }
  }
});

if(Meteor.isServer) {
  Meteor.publish("posts",function(){
    return Posts.find();
  });
}
else {
  Meteor.subscribe("posts");
}