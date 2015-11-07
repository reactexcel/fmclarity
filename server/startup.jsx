console.log("Starting server...");

Meteor.startup(function(){

    var leo = Accounts.findUserByEmail('leo@fmclarity.com');
    if(leo) {
        Users.remove(leo._id);
    }


    Facilities.remove({});
    Issues.remove({});
    Team.remove({});

    var collections = [Issues, Facilities, Contacts, Services, Team];
    var dataSets = [ExampleIssues, ExampleFacilities, ExampleContacts, ExampleServices, ExampleTeams];

    collections.map(function(i,idx){
        if(i.find().count()==0) {
            //console.log('creating example issues...');
            dataSets[idx].map(function(item){
                //console.log({'inserting':item});
                i.insert(item);
            })
        }
        i.remove({isNewItem:true});
    });
})
