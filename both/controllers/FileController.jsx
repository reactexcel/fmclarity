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

        return Files.find();
    });

} else{
  Meteor.subscribe('File');
}