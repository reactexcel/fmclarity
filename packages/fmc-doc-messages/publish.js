if(Meteor.isServer) {
  Meteor.publish("messages",function(collectionName,id,cutoff){
  	var q = {};
  	q["inboxId.collectionName"] = collectionName;
  	if(id) {
	  	q["inboxId.query._id"] = id;
    }
    if(cutoff) {
      q["createdAt"] = {$gte:cutoff};
    }
    //console.log(q);
    return Messages.find(q);
  });
}
else {
  Meteor.subscribe("messages","Issues");
}