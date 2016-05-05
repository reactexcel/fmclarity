if(Meteor.isServer) {
  Meteor.publish("messages",function(collectionName,id){
  	var q = {};
  	q["inboxId.collectionName"] = collectionName;
  	if(id) {
	  	q["inboxId.query._id"] = id;
    }
    //console.log(q);
    return Messages.find(q);
  });
}
else {
  Meteor.subscribe("messages","Issues");
}