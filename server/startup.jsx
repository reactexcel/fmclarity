console.log("Starting server...");

Meteor.startup(function(){

    if(Issues.find().count()==0) {
    	console.log('creating example issues...');
    	ExampleIssues.map(function(item){
    		console.log({'inserting':item});
    		Issues.insert(item);
    	})
    }

    if(Facilities.find().count()==0) {
    	console.log('creating example facilities...');
    	ExampleFacilities.map(function(item){
    		console.log({'inserting':item});
    		Facilities.insert(item);
    	})
    }

    Facilities.remove({isNewItem:true});
    Issues.remove({isNewItem:true});

})
