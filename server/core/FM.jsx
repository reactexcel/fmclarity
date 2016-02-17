FM.resetTestData = function() {

    // destroy existing data
    Teams.remove({});
    Issues.remove({});
    Files.remove({});
    Log.remove({});
    Posts.remove({});
    Facilities.remove({});

    // create core developer accounts if they don't exist
    var brad = TestUsers.create({
        name:'Brad',
        email:'fake@test.com',
    })
    var leo = TestUsers.create({
        name:'Leo',
        email:'mrleokeith@gmail.com',
    })
    var rich = TestUsers.create({
        name:'Rich',
        email:'mr.richo@gmail.com',        
    })
    Users.remove({_id:{$nin:[leo._id,rich._id,brad._id]}});

    var kaplan = TestTeams.create({
        type:"fm",
        name:"Kaplan Australia",
        email:"kaplan@fmclarity.com",
        phone:"0400-123-123",
        members:[{_id:leo._id},{_id:rich._id}]
    });

    var incisive = TestTeams.create({
        type:"fm",
        name:"Incisive Property",
        email:"incisive@fmclarity.com",
        phone:"0400-123-123",
        members:[{_id:leo._id},{_id:rich._id}]
    });

    var clarity = TestTeams.create({
        type:"fm",
        name:"FM Clarity",
        email:"admin@fmclarity.com",
        phone:"0400-123-123",
        members:[{_id:leo._id},{_id:rich._id}]        
    });

    KaplanFacilities.map(function(facilityData){
        var newFacility = TestFacilities.create(facilityData);
        newFacility.setTeam(kaplan);
        if(FM.inDevelopment()) {
            newFacility.addContact(TestUsers.create());        
        }
    })

    if(FM.inDevelopment()) {

        TestUsers.createUsers(10);

        TestTeams.create({
            type:"contractor",
            name:"Normal Contractors",
            email:"contractor1@email.com",
            phone:"0400-123-123",
            members:[{_id:leo._id},{_id:rich._id}],
        });

        TestTeams.create({
            type:"contractor",
            name:"Abnormal Contractors",
            email:"contractor2@email.com",
            phone:"0400-123-123",
            members:[{_id:leo._id},{_id:rich._id}],
        });

        for(var i=0;i<30;i++) {
            TestIssues.create({
                facility:TestFacilities.getRandom(),
                shouldAssignRandomCreator:true
            });
        }
    }
}
