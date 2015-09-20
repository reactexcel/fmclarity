console.log("Starting server...");

Meteor.startup(function(){
	var data = [{
			address:'Blank Street'
		},
		{
			address:'Untitled Lane'
        },
        {
            address:'Incognito Avenue'
        },
        {
            address:'Anonymous Road'
		}];
	console.log(Books.find().fetch());
	if(Books.find().count()==0) {
		console.log('creating intial test data');
	    data.map(function(item){
    		Books.insert(item);
    	})
    }

})
