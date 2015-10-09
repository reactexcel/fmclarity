console.log("Starting server...");

Meteor.startup(function(){

    var collections = [Issues, Facilities, Contacts, Services];
    var dataSets = [ExampleIssues, ExampleFacilities, ExampleContacts, ExampleServices];

    collections.map(function(i,idx){
        if(i.find().count()==0) {
            console.log('creating example issues...');
            dataSets[idx].map(function(item){
                console.log({'inserting':item});
                i.insert(item);
            })
        }
        i.remove({isNewItem:true});
    });
})
