console.log("Starting server...");

Meteor.startup(function(){


    function initializeCollections(collections,datasets) {
        collections.map(function(i,idx){
            if(i.find().count()==0) {
                //console.log('creating example issues...');
                datasets[idx].map(function(item){
                    //console.log({'inserting':item});
                    i.insert(item);
                })
            }
            i.remove({isNewItem:true});
        });        
    }



    var leo1 = Accounts.findUserByEmail('mrleokeith@gmail.com');
    var rich1 = Accounts.findUserByEmail('mr.richo@gmail.com');

    function initializeUsers() {
        Users.remove({_id:{$nin:[leo1._id,rich1._id]}});
        for(var i=0;i<100;i++) {
            var newUser = makeRandomUser();
            Meteor.call('User.new',newUser);
        }
    }


    initializeUsers();

    ExampleTeams = [
      {
        type:"fm",
        name:"Kaplan Australia",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"img/k-100-ltblue.png",
        _members:[{_id:leo1._id},{_id:rich1._id}],
        _contacts:[],
      },
      {
        type:"fm",
        name:"Team Superblah",
        email:"knockers@run.123",
        phone:"0400-223-122",
        thumb:"img/logo-placeholder.png",
        _members:[{_id:leo1._id},{_id:rich1._id}],
        _contacts:[],
      },
      {
        type:"fm",
        name:"Tonsils",
        email:"schturm@run.123",
        phone:"0400-223-122",
        thumb:"img/logo-placeholder.png",
        _members:[{_id:leo1._id}],
        _contacts:[],
      },
      {
        type:"contractor",
        name:"Normal Contractors",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"img/supplier-1.png",
        _members:[{_id:leo1._id},{_id:rich1._id}],
        services:["Mechanical","Fire Prevention","Electrical"]
      },
      {
        type:"contractor",
        name:"Harrison Services",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"img/supplier-2.png",
        _members:[],
        services:["UPS"]
      },
      {
        type:"contractor",
        name:"Rovo",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"img/supplier-3.png",
        _members:[],
        services:["Mechanical","Fire Prevention","Electrical"]
      },
      {
        type:"contractor",
        name:"Shotnick",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"img/supplier-4.png",
        _members:[],
        services:["Lifts","Fire Prevention","Electrical","Water Treatment"]
      },
      {
        type:"contractor",
        name:"ABC Contractors",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"img/supplier-5.png",
        _members:[],
        services:["UPS","Fire Prevention","Egress"]
      },
      {
        type:"contractor",
        name:"DEF Contractors",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"img/supplier-6.png",
        _members:[],
        services:["Generator","E&E Lighting","Water Treatment"]
      }      
    ];


    Facilities.remove({});
    Issues.remove({});
    Teams.remove({});

    var users = Users.find().fetch();
    for(var i in users) {
        var t = Math.floor(Math.random()*ExampleTeams.length);
        ExampleTeams[t]._members.push({_id:users[i]._id});
    }

    initializeCollections(
        [Contacts, Services, Teams],
        [ExampleContacts, ExampleServices, ExampleTeams]        
    );

    var teams = Teams.find({type:"fm"}).fetch();
    for(var i in ExampleFacilities) {
        var r = Math.floor(Math.random()*teams.length);
        ExampleFacilities[i]._team = {_id:teams[r]._id};
    }

    collections = [Facilities];
    dataSets = [ExampleFacilities];

    initializeCollections(
        [Facilities],
        [ExampleFacilities]
    );


    /* Create issues */
    ExampleIssues = [];
    for(var i=0;i<100;i++) {
        var newIssue = TestIssues.generate();
        ExampleIssues.push(newIssue);
    }

    var facilities = Facilities.find({}).fetch();
    var contractors = Teams.find({type:"contractor"}).fetch();
    for(var i in ExampleIssues) {
        var f = Math.floor(Math.random()*facilities.length);
        var c = Math.floor(Math.random()*contractors.length);


        var team = facilities[f].getTeam();
        var members = team.getMembers();
        var m = Math.floor(Math.random()*members.length);

        var status = ExampleIssues[i].status;

        ExampleIssues[i]._team = facilities[f]._team;
        ExampleIssues[i]._creator = {
            _id:members[m]._id,
            name:members[m].name
        };

        ExampleIssues[i]._facility = {
            _id:facilities[f]._id,
            name:facilities[f].name
        };

        if(status!='New') {
            ExampleIssues[i]._contractor = {
                _id:contractors[c]._id,
                name:contractors[c].name
            };
        }
    }

    initializeCollections(
        [Issues],
        [ExampleIssues]
    );

})
