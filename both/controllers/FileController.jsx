FileMeta.schema(FileSchema);

//this should be a wrapper for CollectionFS, then we can, in theory, unplug it in due course
//come to think of it could have a wrapper for user as well - would fix that profile malarkey

FileMeta.methods({
  create:{
    authentication:true,
    method:RBAC.lib.create.bind(FileMeta)
  },
  save:{
    authentication:true,
    method:RBAC.lib.save.bind(FileMeta)
  },
  destroy:{
    authentication:true,
    method:RBAC.lib.destroy.bind(FileMeta)
  }
})

if(Meteor.isServer){
	Files.allow({
		'insert': function () {
	    	// add custom authentication code here
			return true;
		},
		'update':function() {
			return true;
		},
		'remove':function() {
			return true;
		},
		'download':function() {
			return true;
		}
	});
}

if(Meteor.isServer){

    Meteor.publish('File', function () {
        /*Uncomment this and comment out returning the cursor to see publication issue*/

        // var self = this;

        // var handle = Files.find().observe({
        //     added: function (document) {
        //         self.added('images', document._id, document);
        //     },
        //     changed: function (document) {
        //         self.changed('images', document._id, document);
        //     },
        //     removed: function (document) {
        //         self.removed('images', document._id);
        //     }
        // });

        // self.onStop(function () {
        //     handle.stop();
        // });

        /*Comment this out and Uncomment manual publishing to see publication issue*/

        return [Files.find(),FileMeta.find()];

    });

}else{
  Meteor.subscribe('File');
}