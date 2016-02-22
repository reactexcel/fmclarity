FM.resetTestData = function() {

    // destroy existing data
    Teams.remove({});
    Issues.remove({});
    Files.remove({});
    Messages.remove({});
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
        phone:"0400-123-123"
    });

    kaplan.addMember(leo,{role:"support"});
    kaplan.addMember(rich,{role:"support"});

    var incisive = TestTeams.create({
        type:"fm",
        name:"Incisive Property",
        email:"incisive@fmclarity.com",
        phone:"0400-123-123"
    });

    incisive.addMember(leo,{role:"manager"});
    incisive.addMember(rich,{role:"manager"});


    var clarity = TestTeams.create({
        type:"fm",
        name:"FM Clarity",
        email:"admin@fmclarity.com",
        phone:"0400-123-123"
    });

    clarity.addMember(leo,{role:"manager"});
    clarity.addMember(rich,{role:"manager"});

    KaplanFacilities.map(function(facilityData){
        var newFacility = TestFacilities.create(facilityData);
        newFacility.setTeam(kaplan);
        if(FM.inDevelopment()) {
            newFacility.addMember(TestUsers.create(),{role:"contact"});
        }
    })

    if(FM.inDevelopment()) {

        TestUsers.createUsers(10);

        var normal = TestTeams.create({
            type:"contractor",
            name:"Normal Contractors",
            email:"contractor1@email.com",
            phone:"0400-123-123"
        });

        normal.addMember(leo,{role:"manager"});
        normal.addMember(rich,{role:"manager"});

        var abnormal = TestTeams.create({
            type:"contractor",
            name:"Abnormal Contractors",
            email:"contractor2@email.com",
            phone:"0400-123-123"
        });

        abnormal.addMember(leo,{role:"manager"});
        abnormal.addMember(rich,{role:"manager"});

        for(var i=0;i<30;i++) {
            TestIssues.create({
                facility:TestFacilities.getRandom(),
                shouldAssignRandomCreator:true
            });
        }
    }
}
