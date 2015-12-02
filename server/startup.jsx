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

    // Use find/create pattern here

    //Meteor.users.remove({});
    var leo1,rich1,leoId,richId,system,systemId;
    leo1 = Accounts.findUserByEmail('mrleokeith@gmail.com');
    if(!leo1) {
        Meteor.call('User.new',{
            name:'Leo',
            email:'mrleokeith@gmail.com',
        },'fm1q2w3e');
        leo1 = Accounts.findUserByEmail('mrleokeith@gmail.com');
    }
    system = Accounts.findUserByEmail('system@fmclarity.com');
    if(!system) {
        Meteor.call('User.new',{
            name:'System',
            email:'system@fmclarity.com',
        },'fm1q2w3e');
        system = Accounts.findUserByEmail('system@fmclarity.com');
    }

    rich1 = Accounts.findUserByEmail('mr.richo@gmail.com');
    if(leo1) {
        leoId = leo1._id;
    }
    if(rich1) {
        richId = rich1._id;
    }
    if(system) {
        systemId = system._id;
    }
    Facilities.remove({});
    Issues.remove({});
    Teams.remove({});
    Log.remove({});

    function initializeUsers() {
        Users.remove({_id:{$nin:[leoId,richId]}});
        for(var i=0;i<100;i++) {
            var newUser = makeRandomUser();
            var newUserId = Meteor.call('User.new',newUser);
            //FM.notify(system,"created",['User',{_id:newUserId}]);
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
        timeframes:{
            "Scheduled":24*7,
            "Standard":24*3,
            "Urgent":24,
            "Critical":0
        },
        _members:[{_id:leoId},{_id:richId}],
        _contacts:[],
      },
      /*
      {
        type:"fm",
        name:"Team Superblah",
        email:"knockers@run.123",
        phone:"0400-223-122",
        thumb:"img/logo-placeholder.png",
        _members:[{_id:leoId}],
        _contacts:[],
      },
      {
        type:"fm",
        name:"Tonsils",
        email:"schturm@run.123",
        phone:"0400-223-122",
        thumb:"img/logo-placeholder.png",
        _members:[{_id:leoId}],
        _contacts:[],
      },
      */
      {
        type:"contractor",
        name:"Normal Contractors",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"img/supplier-1.png",
        _members:[{_id:leoId},{_id:richId}],
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




    for(var i in ExampleTeams) {
        var team = ExampleTeams[i];
        if(team.type=='fm') {
            ExampleTeams[i].modules = {
                "Dashboard":true,
                "Facilities":true,
                "PMP":false,
                "ABC":false,
                "Work Requests":true,
                "Suppliers":true,
                "Sustainability":false,
                "Contracts":false,
                "Reports":false
            };
        }
        else {
            ExampleTeams[i].modules = {
                "Dashboard":false,
                "Facilities":true,
                "PMP":false,
                "ABC":false,
                "Work Requests":true,
                "Suppliers":false,
                "Sustainability":false,
                "Contracts":false,
                "Reports":false
            };
        }
    }

    var users = Users.find().fetch();
    for(var i in users) {
        var t = Math.floor(Math.random()*ExampleTeams.length);
        ExampleTeams[t]._members.push({_id:users[i]._id});
    }

    initializeCollections(
        [Teams],
        [ExampleTeams]        
    );

    var teams = Teams.find({type:"fm"}).fetch();
    for(var i in ExampleFacilities) {
        var r = Math.floor(Math.random()*teams.length);
        var contact = makeRandomUser();
        var contactId = Meteor.call('User.new',contact);

        ExampleFacilities[i].areas = [
            {
                name:'Standard level',
                number:1,
                areas:[
                    {
                        name:'Male bathroom',
                        location:'North',
                        number:1
                    },{
                        name:'Female bathroom',
                        location:'North',
                        number:1
                    },{
                        name:'Male bathroom',
                        location:'South',
                        number:1
                    },{
                        name:'Kitchen',
                        number:1
                    },{
                        name:'Work room',
                        number:5
                    }
                ]
            },
            {
                name:'Unique areas',
                number:1,
                areas:[
                    {
                        name:'Reception',
                        number:1
                    },{
                        name:'Basement',
                        number:1
                    }
                ]
            }
        ];

        ExampleFacilities[i].services = JSON.parse(JSON.stringify(Config.services));

        ExampleFacilities[i]._contacts = [{
            _id:contactId,
            name:contact.name,
            phone:contact.phone,
            email:contact.email
        }];

        ExampleFacilities[i]._team = {_id:teams[r]._id};
        ExampleFacilities[i].lease = {
            parking:{},
            insuranceDetails:{},
            securityDeposit:{},
        };
        ExampleFacilities[i].holder = {
            address:{},
        };        
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

        ExampleIssues[i].code = Math.floor(Math.random()*1000);

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
            ExampleIssues[i]._supplier = {
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
