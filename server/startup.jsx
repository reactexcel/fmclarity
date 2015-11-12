console.log("Starting server...");

Meteor.startup(function(){

    var leo1 = Accounts.findUserByEmail('mrleokeith@gmail.com');
    var leo2 = Accounts.findUserByEmail('leo@fmclarity.com');
    var rich1 = Accounts.findUserByEmail('mr.richo@gmail.com');
    var rich2 = Accounts.findUserByEmail('rich@fmclarity.com');
    leo2?Users.remove(leo2._id):null;
    rich2?Users.remove(rich2._id):null;

    ExampleTeams = [
      {
        type:"fm",
        name:"Team Blah",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-1.png",
        _members:[{_id:leo1._id},{_id:rich1._id}],
        _contacts:[]
      },
      {
        type:"fm",
        name:"Team Superblah",
        email:"knockers@run.123",
        phone:"0400-223-122",
        thumb:"supplier-1.png",
        _members:[{_id:leo1._id},{_id:rich1._id}],
        _contacts:[]
      },
      {
        type:"fm",
        name:"Tonsils",
        email:"schturm@run.123",
        phone:"0400-223-122",
        thumb:"supplier-1.png",
        _members:[{_id:leo1._id}],
        _contacts:[]
      },
      {
        type:"contractor",
        name:"Normal Contractors",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-1.png",
        _members:[{_id:leo1._id},{_id:rich1._id}],
        services:["Mechanical","Fire Prevention","Electrical"]
      },
      {
        type:"contractor",
        name:"Harrison Services",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-2.png",
        services:["UPS"]
      },
      {
        type:"contractor",
        name:"Rovo",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-3.png",
        services:["Mechanical","Fire Prevention","Electrical"]
      },
      {
        type:"contractor",
        name:"Shotnick",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-4.png",
        services:["Lifts","Fire Prevention","Electrical","Water Treatment"]
      },
      {
        type:"contractor",
        name:"ABC Contractors",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-5.png",
        services:["UPS","Fire Prevention","Egress"]
      },
      {
        type:"contractor",
        name:"DEF Contractors",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-6.png",
        services:["Generator","E&E Lighting","Water Treatment"]
      }      
    ];


    Facilities.remove({});
    Issues.remove({});
    Teams.remove({});

    var collections = [Contacts, Services, Teams];
    var dataSets = [ExampleContacts, ExampleServices, ExampleTeams];

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

    var teams = Teams.find({type:"fm"}).fetch();
    for(var i in ExampleFacilities) {
        var r = Math.floor(Math.random()*teams.length);
        ExampleFacilities[i]._team = {_id:teams[r]._id};
    }

    collections = [Facilities];
    dataSets = [ExampleFacilities];

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


    var facilities = Facilities.find({}).fetch();
    for(var i in ExampleIssues) {
        var r = Math.floor(Math.random()*facilities.length);
        ExampleIssues[i]._facility = {
            _id:facilities[r]._id,
            name:facilities[r].name
        };
        ExampleIssues[i]._team = facilities[r]._team;
    }

    collections = [Issues];
    dataSets = [ExampleIssues];

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
