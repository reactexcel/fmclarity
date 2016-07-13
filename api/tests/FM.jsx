//This is all a bit ugle really - should it just be removed all together?

TeamsData = {
    kaplan:{
        type:"fm",
        name:"Kaplan Australia Pty Ltd",
        email:"kaplan@fmclarity.com",
        phone:"0400-123-123",
        services:[{
            name:"General R&M",
            active:true,
        },{
            name:"OHS",
            active:true
        }]
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
        phone:"0400-123-123",
        services:KaplanServices        
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
            name:"Air Conditioning",
            active:true,
        }]
    },
    aperture:{
        type:"contractor",
        name:"Aperture Electrical",
        email:"admin@aperturelighting.com.au",
        services:[{
            name:"Electrical",
            active:true
        },
        {
            name:"Data",
            active:true
        },
        {
            name:"Lightning protection",
            active:true
        }]
    },
    clearway:{
        type:"contractor",
        name:"Clearway plumbing",
        email:"sales@clearway.com.au",
        services:[{
            name:"Plumbing",
            active:true
        }]
    }
}

UsersData = {
    brad:{
        name:'Brad',
        email:'brad.wilkinson@kaplan.edu.au',
        phone:'0424187601',
        phone2:'(03)96264549'
    },
    leo:{
        name:'Leo',
        email:'mrleokeith@gmail.com'
    },
    admin:{
        name:'Admin',
        email:'admin@fmclarity.com'
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

function addKaplanContractor(kaplan,details) {

    console.log(details.name);

    for(var i in details.services) {
        details.services[i].active = true;
    }

    var supplierDetails = {
        name:details.name,
        type:"contractor",
        email:details.email,
        phone:details.phone,
        phone2:details.phone2,
        services:details.services,
        owner:{
            type:"team",
            name:kaplan.getName(),
            _id:kaplan._id
        }
    }

    var supplier = Teams.findOne({name:supplierDetails.name});
    if(!supplier) {
        Meteor.call('Teams.create',supplierDetails);
        supplier = Teams.findOne({name:supplierDetails.name});
    }

    if(details.manager&&details.email&&details.manager.length) {
        var temp = details.manager.split(' ');
        var managerDetails = {
            name:details.manager,
            firstName:temp[0],
            lastName:temp[1],
            email:details.email,
            phone:details.phone,
            phone2:details.phone2,
            owner:{
                type:"team",
                name:kaplan.getName(),
                _id:kaplan._id
            }
        }

        var manager = TestUsers.create(managerDetails,null,true);
        supplier.addMember(manager,{role:"manager"});
    }

    kaplan.addSupplier(supplier);
}

function makeKaplanContractors(kaplan) {
    //should go in a single structure in KaplanData.jsx
    addKaplanContractor(kaplan,{
        name:"OPIndustries",
        manager:"Michelle Cooper",
        email:"mcooper@opmelbourne.com.au",
        phone:"(03)98748555",
        phone2:"1300553395",
        services:[{name:"Air Conditioning"}]
    });
    addKaplanContractor(kaplan,{
        name:"Emerson",
        manager:"Natalie Mahomet",
        email:"Natalie.Mahomet@Emerson.com",
        phone:"(02)99142248",
        services:[{name:"Air Conditioning"}]
    });
    addKaplanContractor(kaplan,{
        name:"Sharper Cleaning",
        manager:"Nitish Aserigadu",
        email:"nitish@sharperclearning.com.au",
        phone:"0487878728",
        services:[{name:"Cleaning"}]
    });
    addKaplanContractor(kaplan,{
        name:"Rentokil Initial",
        manager:"Paul James",
        email:"paul.james@rentokil-initial.com",
        phone:"0424014066",
        phone2:"(03)99443300",
        services:[{name:"Cleaning"},{name:"Pest Control"}]
    });
    addKaplanContractor(kaplan,{
        name:"Chubb",
        manager:"Brooke Hardwick",
        email:"Brooke.Hardwick@chubb.com.au",
        phone:"0401771760",
        phone2:"(03)92649850",
        services:[{name:"Emergency Management Planning"}]
    });
    addKaplanContractor(kaplan,{
        name:"AESM",
        manager:"Christine Hocking",
        email:"Christine@aesm.com.au",
        phone:"(03)97634799",
        services:[{name:"Fire Protection"}]
    });
    addKaplanContractor(kaplan,{
        name:"Stokes Safety",
        manager:"Kim Whelan",
        email:"kim@stokessafety.com.au",
        phone:"1800058342",
        services:[{name:"Essential Safety Measures"}]
    });
    addKaplanContractor(kaplan,{
        name:"TBM",
        manager:"Simon O'Farrell",
        email:"tbmelec@bigpond.net.au",
        phone:" 0400226703",
        services:[{name:"Electrical"}]
    });
    addKaplanContractor(kaplan,{
        name:"Rutherford Electrical",
        manager:"Paul Rutherford",
        email:"p.rutherford@bigpond.com",
        phone:" 0408106033",
        services:[{name:"Electrical"}]
    });
    addKaplanContractor(kaplan,{
        name:"Thermoscan",
        services:[{name:"Air Conditioning"},{name:"Heating"}]
    });
    addKaplanContractor(kaplan,{
        name:"R W Gill",
        manager:"Trudi ",
        email:"plumbing@rwgill.com.au",
        phone:"(03)94280100",
        phone2:"0417135427",
        services:[{name:"Plumbing"}]
    });
    addKaplanContractor(kaplan,{
        name:"Butlers",
        manager:"Doug Butler",
        email:"butler.douglas@hotmail.com",
        phone:"0418533679",
        services:[{name:"Cleaning"}]
    });
    addKaplanContractor(kaplan,{
        name:"Dorma",
        phone:"1800675411",
        services:[{name:"Door Maintenence"}]
    });
    addKaplanContractor(kaplan,{
        name:"Otis",
        manager:"Allistair ",
        email:"",
        phone:"0466469958",
        services:[{name:"Lifts"}]
    });
    addKaplanContractor(kaplan,{
        name:"Wilson Security",
        manager:"",
        email:"",
        phone:"1300945766",
        services:[{name:"Security"}]
    });
    addKaplanContractor(kaplan,{
        name:"Royal Eagle",
        manager:"Bethany ",
        email:"security@ress.com.au",
        phone:"(03) 9696 3199",
        services:[{name:"Access Control"},{name:"Security"}]
    });
    addKaplanContractor(kaplan,{
        name:"Monjon",
        manager:"",
        email:"monjon@monjon.com.au",
        phone:"(03)95219676",
        phone2:"0417666566",
        services:[{name:"Security"}]
    });
    addKaplanContractor(kaplan,{
        name:"Transpacific",
        manager:"",
        email:"CLWYAUCustomerService.MelbourneIndustrial@transpac.com.au",
        phone:"131339",
        services:[{name:"Rubbish Removal"}]
    });
    addKaplanContractor(kaplan,{
        name:"Quench",
        manager:"",
        email:"www.quench.com.au",
        phone:"(03)95557771",
        services:[{name:"Water Coolers"}]
    });
    addKaplanContractor(kaplan,{
        name:"Neverfail",
        manager:"",
        email:"",
        phone:"",
        services:[{name:"Water Coolers"}]
    });
    addKaplanContractor(kaplan,{
        name:"Aqua Clear",
        manager:"Kylie Worcester",
        email:"kylie@aquaclear.com.au",
        phone:"97413131",
        services:[{name:"Water Coolers"}]
    });
    addKaplanContractor(kaplan,{
        name:"Merit Interiors",
        manager:"Andrew Campion",
        email:"andrew@meritinteriors.com.au",
        phone:"(03)52276100",
        phone2:"0439011209",
        services:[{name:"Interiors"}]
    });
    addKaplanContractor(kaplan,{
        name:"Zircon",
        manager:"Tristan Weeks",
        email:"tristan@corporatebusinessfurniture.com.au",
        phone:"0448012997",
        services:[{name:"Scanning"}]
    });
    addKaplanContractor(kaplan,{
        name:"Corporate Business Furniture",
        manager:"Tristan Weeks",
        email:"tristan@corporatebusinessfurniture.com.au",
        phone:"0448012997",
        services:[{name:"Furniture"}]
    });
    addKaplanContractor(kaplan,{
        name:"Intermain",
        manager:"Andrew Blake",
        email:"a.blake@intermain.com.au",
        phone:"(02)93182272",
        phone2:"0434770307",
        services:[{name:"Fitouts"}]
    });
    addKaplanContractor(kaplan,{
        name:"Cortrols",
        manager:"Neol Dean",
        email:"neol@cortrols.com.au",
        phone:"98506155",
        phone2:"0407040478",
        services:[{name:"Air Conditioning"},{name:"Heating"}]
    });
    addKaplanContractor(kaplan,{
        name:"eSafe",
        manager:"Hamish McWhirr",
        email:"service@esafeservices.com.au",
        phone:"(08)83421127",
        phone2:"0401147903",
        services:[{name:"Kitchen Equipment"}]
    });
    addKaplanContractor(kaplan,{
        name:"Ambius",
        manager:"Jackie Graham",
        email:"jackie.graham@ambius.com",
        phone:"0431995270",
        phone2:"(03)99443333",
        services:[{name:"Plants"}]
    });
    addKaplanContractor(kaplan,{
        name:"Integral",
        manager:"Matt Currie",
        email:"MCurrie@eintegral.com.au",
        phone:"0439393002",
        services:[{name:"Cleaning"}]
    });
    addKaplanContractor(kaplan,{
        name:"JLL",
        manager:"",
        email:"",
        phone:"",
        phone2:"",
        services:[{name:"High Access"}]
    });
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
    var admin = TestUsers.create(UsersData['admin'],'fm1q2w3e');
    var rich = TestUsers.create(UsersData['rich'],'fm1q2w3e');
    var dan = TestUsers.create(UsersData['dan'],'fm1q2w3e');

    //and remove all of the others
    Users.remove({_id:{$nin:[leo._id,rich._id,brad._id,dan._id,admin._id]}});

    //create users
    var contractor = TestUsers.create(UsersData['contractor']);
    var fixer = TestUsers.create(UsersData['fixer']);
    var staff = TestUsers.create(UsersData['staff']);
    var tenant = TestUsers.create(UsersData['tenant']);
    var contact = TestUsers.create(UsersData['contact']);

    //set up kaplan
    var kaplan = TestTeams.create(TeamsData['kaplan']);
    kaplan.addMember(brad,{role:"manager"});
    kaplan.addMember(leo,{role:"manager"});
    kaplan.addMember(rich,{role:"manager"});
    kaplan.addFacilities(KaplanFacilities);
    kaplan.addSupplier(kaplan);

    var docklands = Facilities.findOne({name:"Docklands"});
    docklands.addMember(brad,{role:"contact"});

    makeKaplanContractors(kaplan);

    //set up fmclarity
    var clarity = TestTeams.create(TeamsData['clarity']);
    clarity.addMember(leo,{role:"manager"});
    clarity.addMember(rich,{role:"manager"});

    kaplan.addSupplier(clarity);

    //set up contractors
    var normal = TestTeams.create(TeamsData['normal']);
    normal.addMember(leo,{role:"manager"});
    //normal.addMember(contractor,{role:"manager"});
    //normal.addMember(fixer,{role:"staff"});
    var abnormal = TestTeams.create(TeamsData['abnormal']);
    //abnormal.addMember(TestUsers.create(),{role:"manager"});
    //abnormal.addMember(TestUsers.create(),{role:"staff"});
    var expert = TestTeams.create(TeamsData['expert']);
    var aperture = TestTeams.create(TeamsData['aperture']);
    var clearway = TestTeams.create(TeamsData['clearway']);

    //set up incisive
    var incisive = TestTeams.create(TeamsData['incisive']);
    incisive.addMember(leo,{role:"staff"});
    incisive.addMember(rich,{role:"manager"});
    incisive.addFacilities(IncisiveFacilities);
    //incisive.addMember(TestUsers.create(),{role:"staff"});
    //incisive.addMember(TestUsers.create(),{role:"staff"});
    var facilities = incisive.getFacilities();
    //facilities[0].addMember(tenant,{role:"tenant"});
    //facilities[1].addMember(contact,{role:"contact"});
    //facilities.map(function(f){
        //f.addMember(TestUsers.create(),{role:"contact"});
        //f.addMember(TestUsers.create(),{role:"tenanant"});
    //})


    if(FM.inDevelopment()) {

        incisive.addSupplier(incisive);
        incisive.addSupplier(expert);
        incisive.addSupplier(clearway);
        incisive.addSupplier(aperture);
        incisive.addSupplier(normal);

        incisive = Teams.findOne(incisive._id);
        var incisiveFacilities = incisive.getFacilities();
        for(var i=0;i<2;i++) {
            var facility = getRandom(incisiveFacilities);
            var owner = getRandom(incisive.getMembers());
            var request = incisive.createRequest({
                facility:{
                    _id:facility._id,
                    name:facility.getName()
                },
                owner:{
                    _id:owner._id,
                    name:owner.getName()
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
    }

    //set up buildcost
    var buildcost = TestTeams.create(TeamsData['buildcost']);
    buildcost.addMember(dan,{role:"manager"});
    buildcost.addMember(leo,{role:"manager"});
    buildcost.addMember(rich,{role:"manager"});

}
