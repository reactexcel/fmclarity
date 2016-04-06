TeamsData = {
    kaplan:{
        type:"fm",
        name:"Kaplan Australia",
        email:"kaplan@fmclarity.com",
        phone:"0400-123-123"        
    },
    buildcost:{
        type:"fm",
        name:"Buildcost",
        email:"dan.waters@buildcost.net.au"
    },
    incisive:{
        type:"fm",
        name:"Incisive Property",
        email:"incisive@fmclarity.com",
        phone:"0400-123-123"        
    },
    clarity:{
        type:"fm",
        name:"FM Clarity",
        email:"admin@fmclarity.com",
        phone:"0400-123-123"        
    },
    normal:{
        type:"contractor",
        name:"Normal Contractors",
        email:"contractor1@email.com",
        phone:"0400-123-123"        
    },
    abnormal:{
        type:"contractor",
        name:"Abnormal Contractors",
        email:"contractor2@email.com",
        phone:"0400-123-123"        
    },
    expert:{
        type:"contractor",
        name:"Expert Systems",
        email:"tech@expertsystems.com.au",
        services:[{
            name:"Air Conditioning"
        }]
    },
    aperture:{
        type:"contractor",
        name:"Aperture Electrical",
        email:"admin@aperturelighting.com.au",
        services:[{
            name:"Electrical"
        },
        {
            name:"Data"
        },
        {
            name:"Lightning protection"
        }]
    },
    clearway:{
        type:"contractor",
        name:"Clearway plumbing",
        email:"sales@clearway.com.au",
        services:[{
            name:"Plumbing"
        }]
    }
}

UsersData = {
    brad:{
        name:'Brad',
        email:'fake@test.com'        
    },
    leo:{
        name:'Leo',
        email:'mrleokeith@gmail.com'
    },
    rich:{
        name:'Rich',
        email:'mr.richo@gmail.com'        
    },
    dan:{
        name:'Dan',
        email:'dan.waters@buildcost.net.au'
    },
    contractor:{
        name:'Billy Contractor',
        email:'contractor@email.com'
    },
    fixer:{
        name:'Harold Fixer',
        email:'fixer@email.com'
    },
    staff:{
        name:'Peter Staff',
        email:'staff@email.com'
    },
    tenant:{
        name:'Jimmy Tenant',
        email:'tenant@email.com'
    },
    contact:{
        name:'Melissa Contact',
        email:'contact@email.com'
    }
}

function getRandom(items) {
    var i = Math.floor(Math.random()*items.length);
    return items[i];
}


FM.resetTestData = function() {

    //destroy existing data
    Teams.remove({});
    Issues.remove({});
    Files.remove({});
    Messages.remove({});
    Facilities.remove({});

    TestUsers.makeThumbs();
    TestTeams.makeThumbs();
    TestFacilities.makeThumbs();

    IncisiveFacilities.map(function(f){
        f.thumb = TestFacilities.getThumb();
    })

    KaplanFacilities.map(function(f){
        f.thumb = TestFacilities.getThumb();
    })

    //create core developer accounts if they don't exist
    var brad = TestUsers.create(UsersData['brad'],'fm1q2w3e');
    var leo = TestUsers.create(UsersData['leo'],'fm1q2w3e');
    var rich = TestUsers.create(UsersData['rich'],'fm1q2w3e');
    var dan = TestUsers.create(UsersData['dan'],'fm1q2w3e');

    //and remove all of the others
    Users.remove({_id:{$nin:[leo._id,rich._id,brad._id,dan._id]}});

    //create users
    var contractor = TestUsers.create(UsersData['contractor']);
    var fixer = TestUsers.create(UsersData['fixer']);
    var staff = TestUsers.create(UsersData['staff']);
    var tenant = TestUsers.create(UsersData['tenant']);
    var contact = TestUsers.create(UsersData['contact']);

    //set up kaplan
    var kaplan = TestTeams.create(TeamsData['kaplan']);
    kaplan.addMember(leo,{role:"manager"});
    kaplan.addMember(rich,{role:"manager"});
    kaplan.addFacilities(KaplanFacilities);
    kaplan.addSupplier(kaplan);

    //set up fmclarity
    var clarity = TestTeams.create(TeamsData['clarity']);
    clarity.addMember(leo,{role:"manager"});
    clarity.addMember(rich,{role:"manager"});

    //set up contractors
    var normal = TestTeams.create(TeamsData['normal']);
    normal.addMember(contractor,{role:"manager"});
    normal.addMember(fixer,{role:"staff"});
    var abnormal = TestTeams.create(TeamsData['abnormal']);
    abnormal.addMember(TestUsers.create(),{role:"manager"});
    abnormal.addMember(TestUsers.create(),{role:"staff"});
    var expert = TestTeams.create(TeamsData['expert']);
    var aperture = TestTeams.create(TeamsData['aperture']);
    var clearway = TestTeams.create(TeamsData['clearway']);

    //set up incisive
    var incisive = TestTeams.create(TeamsData['incisive']);
    incisive.addMember(leo,{role:"staff"});
    incisive.addMember(rich,{role:"manager"});
    incisive.addFacilities(IncisiveFacilities);
    incisive.addMember(TestUsers.create(),{role:"staff"});
    incisive.addMember(TestUsers.create(),{role:"staff"});
    var facilities = incisive.getFacilities();
    facilities[0].addMember(tenant,{role:"tenant"});
    facilities[1].addMember(contact,{role:"contact"});
    facilities.map(function(f){
        f.addMember(TestUsers.create(),{role:"contact"});
        f.addMember(TestUsers.create(),{role:"tenanant"});
    })


    //if(FM.inDevelopment()) {

        incisive.addSupplier(incisive);
        incisive.addSupplier(expert);
        incisive.addSupplier(clearway);
        incisive.addSupplier(aperture);
        incisive.addSupplier(normal);

        incisive = Teams.findOne(incisive._id);
        var incisiveFacilities = incisive.getFacilities();
        for(var i=0;i<50;i++) {
            var facility = getRandom(incisiveFacilities);
            var creator = getRandom(incisive.getMembers());
            var request = incisive.createRequest({
                facility:{
                    _id:facility._id,
                    name:facility.getName()
                },
                creator:{
                    _id:creator._id,
                    name:creator.getName()
                },
                createdAt:TestIssues.getRandomCreationDate()
            });
            var basicDetails = TestIssues.getRandomTitleAndDescription();
            request.name = basicDetails.name;
            request.description = basicDetails.description;
            request.priority = TestIssues.getRandomPriority(request);
            request.costThreshold = (Math.floor(Math.random()*50)*10);
            request.service = getRandom(facility.services);
            request.subservice = getRandom(request.service.children);
            request.save();
            request.open();
            var chance = Math.random();
            if(chance<0.66) {
                var supplier = getRandom(request.getPotentialSuppliers());
                var level = getRandom(facility.levels);
                var area = level.type.children?getRandom(level.type.children):null;
                _.extend(request,{
                    supplier:{
                        _id:supplier._id,
                        name:supplier.name
                    },
                    level:level,
                    area:area
                });
                request.save();
                request.issue();
                if(chance<0.33) {
                    request.close();
                }
            }
        }
    //}

    //set up buildcost
    var buildcost = TestTeams.create(TeamsData['buildcost']);
    buildcost.addMember(dan,{role:"manager"});
    buildcost.addMember(leo,{role:"manager"});
    buildcost.addMember(rich,{role:"manager"});

}
