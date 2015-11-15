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

    function getRandom(items) {
        var i = Math.floor(Math.random()*items.length);        
        return items[i];
    }

    function makeRandomEmailAddress(user) {
        var servers =[
            'notmail.com','email.org','rottenmail.net','dubious.de','xx.drifthome.com','racidmail.com','deadmail.com'
        ];
        var sillyWords = [
            'orgasmo','troll','zombie','ninja','senseless','savethewhales','awkward','lolz','96','97','98','99','80','mad','original','the-first','free-kevin'
        ];
        var titles = {
            male:['mr','dr','mister','master'],
            female:['ms','miss','mrs','dr']
        };
        var algorithms = [
            function firstAndLast(f,l,g) {
                return f+'.'+l;
            },
            function firstIntialAndLast(f,l,g) {
                return f[0]+'.'+l;
            },
            function firstAndSilly(f,l,g) {
                return f+'-'+getRandom(sillyWords);
            },
            function lastAndSilly(f,l,g) {
                return l+'-'+getRandom(sillyWords);
            },
            function titleFull(f,l,g) {
                return getRandom(titles[g])+'.'+f[0]+'.'+l;
            },
            function sillyWordAndNumber(f,l,g) {
                return getRandom(sillyWords)+(Math.floor(Math.random()*1000));
            },
            function lastNameAndNumber(f,l,g) {
                return l+(Math.floor(Math.random()*1000));
            }
        ];
        var selectedAlgorithm = getRandom(algorithms);
        var email = selectedAlgorithm(user.firstName,user.lastName,user.gender)+'@'+getRandom(servers);
        return email.toLowerCase();
    }

    function makeRandomPhoneNumber() {
        var first = Math.floor(Math.random()*9);        
        var second = Math.floor(Math.random()*999);        
        var third = Math.floor(Math.random()*999); 
        return '+614'+first+'-'+second+'-'+third;    
    }

    function makeRandomThumbnail() {
        var first = Math.floor(Math.random()*9)+1;
        return 'a'+first+'.jpg';       
    }

    function makeRandomUser() {
        var firstNames = {
            male:[
                "Jack","John","Smithy","Peter","Reginald","Pat","Edward","Charles","Dick","Harry","Princeton","David","Frank","Loius","Darren","Warren","Gary","Geoff","Edmond","Gareth","Steven","Samuel","Cameron"
            ],
            female:[
                "Penny","Amy","Pearl","Eliza","Hanna","Aleisha","Erica","Claire","Margaret","Mary","Josephine","Lulu","Casey","Rebecca","Crystal","Kim","Kimberly","Madeleine","Emma","Jane","Marie","Patsy","Dani"
            ]
        }
        var surnames = [
            "Fitzpatrick","Smith","Jones","Harrison","Abdul","Norton","Turner","Paris","Clarence","Edmonton","McDonald","McGibbon","Cheney","Rumsfeld","Bradley","Rottenberg","Rockwell","Phillips","Harrington","Singh","Clarkson","Kardashian"
        ];
        var genders = ['male','female'];
        var user = {};
        user.gender = getRandom(genders);
        user.firstName = getRandom(firstNames[user.gender]);
        user.lastName = getRandom(surnames);
        user.name = user.firstName+' '+user.lastName;
        user.phone = makeRandomPhoneNumber();
        user.thumb = makeRandomThumbnail();
        user.email = makeRandomEmailAddress(user);
        return user;
    }

    var leo1 = Accounts.findUserByEmail('mrleokeith@gmail.com');
    var rich1 = Accounts.findUserByEmail('mr.richo@gmail.com');

    function initializeUsers() {
        Users.remove({_id:{$nin:[leo1._id,rich1._id]}});
        for(var i=0;i<100;i++) {
            var newUser = makeRandomUser();
            console.log(newUser);
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
        thumb:"k-100-ltblue.png",
        _members:[{_id:leo1._id},{_id:rich1._id}],
        _contacts:[],
      },
      {
        type:"fm",
        name:"Team Superblah",
        email:"knockers@run.123",
        phone:"0400-223-122",
        thumb:"logo-placeholder.png",
        _members:[{_id:leo1._id},{_id:rich1._id}],
        _contacts:[],
      },
      {
        type:"fm",
        name:"Tonsils",
        email:"schturm@run.123",
        phone:"0400-223-122",
        thumb:"logo-placeholder.png",
        _members:[{_id:leo1._id}],
        _contacts:[],
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
        _members:[],
        services:["UPS"]
      },
      {
        type:"contractor",
        name:"Rovo",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-3.png",
        _members:[],
        services:["Mechanical","Fire Prevention","Electrical"]
      },
      {
        type:"contractor",
        name:"Shotnick",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-4.png",
        _members:[],
        services:["Lifts","Fire Prevention","Electrical","Water Treatment"]
      },
      {
        type:"contractor",
        name:"ABC Contractors",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-5.png",
        _members:[],
        services:["UPS","Fire Prevention","Egress"]
      },
      {
        type:"contractor",
        name:"DEF Contractors",
        email:"xyz@abc.123",
        phone:"0400-123-123",
        thumb:"supplier-6.png",
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

    var facilities = Facilities.find({}).fetch();
    var contractors = Teams.find({type:"contractor"}).fetch();
    for(var i in ExampleIssues) {
        var f = Math.floor(Math.random()*facilities.length);
        var c = Math.floor(Math.random()*contractors.length);
        var status = ExampleIssues[i].status;

        ExampleIssues[i]._team = facilities[f]._team;

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
