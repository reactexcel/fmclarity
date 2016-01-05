Feeds = FM.createCollection('Feeds',{
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
  },
  forwardTo:{
    type:[String]
  }
});

Feeds.helpers({
  addPost(post,idx,callback) {
    var feed = this;
    if(!this.posts) {
      this.posts = [];
    }
    if(!idx) {
      idx = this.posts.length;
    }
    Meteor.call('Posts.new',post,function(err,newId){
      console.log({err:err,data:newId});
      feed.posts[idx] = {_id:newId};
      Meteor.call('Feeds.save',feed,callback);
    })
  }
});

Posts = FM.createCollection('Posts',{
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
});

// This should be feedsAndPosts
if(Meteor.isServer) {

  Meteor.publish("feeds",function(){
    return Feeds.find();
  });
  Meteor.publish("posts",function(){
    return Posts.find();
  });
}
else {
  Meteor.subscribe("feeds");
  Meteor.subscribe("posts");
}