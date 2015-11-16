
function shuffle(array) {
	array = array.slice(0);
	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
  	return array;
}

TestUsers = {};

TestUsers.portraits = {
	male:[],
	female:[]
}

for(var i=0;i<96;i++) {
	TestUsers.portraits.male.push('http://api.randomuser.me/portraits/men/'+i+'.jpg');
	TestUsers.portraits.female.push('http://api.randomuser.me/portraits/women/'+i+'.jpg');
}


TestUsers.portraits.male = shuffle(TestUsers.portraits.male);
TestUsers.portraits.female = shuffle(TestUsers.portraits.female);


    function getRandom(items) {
        var i = Math.floor(Math.random()*items.length);        
        return items[i];
    }

    function makeRandomEmailAddress(user) {
        var servers =[
            'amail.com',
            'bmail.com',
            'cmail.com',
            'dmail.com',
            'email.com',
            'notmail.com',
            'deadwhitemail.com',
            'hale.edu',
            'intitute.gov.au',
            'lively.com'
        ];
        var sillyWords = [
            'orgasmo',
            'troll',
            'zombie',
            'ninja',
            'senseless',
            'savethewhales',
            'awkward',
            'insatiable',
            'lolz',
            '96',
            '97',
            '98',
            '99',
            '80',
            'mad',
            'original',
            'the-first',
            'free-kevin'
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

    function makeRandomThumbnail(user) {
        //var first = Math.floor(Math.random()*50)+1;
        //return 'a'+first+'.jpg';
        //var gender = user.gender=='male'?'men/':'women/';
        //return 'http://api.randomuser.me/portraits/'+gender+first+'.jpg';
        return TestUsers.portraits[user.gender].pop();
    }

    makeRandomUser = function() {
        var firstNames = {
            male:[
                "Adam",
                "Barry",
                "Bruce",
                "Charles",
                "Cameron",
                "Darren",
                "David",
                "Dick",
                "Edmond",
                "Edward",
                "Frank",
                "Gary",
                "Geoff",
                "Gareth",
                "Harry",
                "Ignatius",
                "Jack",
                "John",
                "Keith",
                "Loius",
                "Matthew",
                "Neil",
                "Omar",
                "Peter",
                "Princeton",
                "Pat",
                "Quincy",
                "Reginald",
                "Smithy",
                "Steven",
                "Samuel",
                "Tomas",
                "Ustinov",
                "Victor",
                "Warren",
                "Xavier",
                "Yendle",
                "Zack",
            ],
            female:[
                "Amy",
                "Aleisha",
                "Casey",
                "Claire",
                "Crystal",
                "Dianna",
                "Dani",
                "Eliza",
                "Erica",
                "Emma",
                "Frida",
                "Greta",
                "Hanna",
                "Isobel",
                "Josephine",
                "Jane",
                "Kitty",
                "Kimberly",
                "Lulu",
                "Mary-Jane",
                "Margaret",
                "Marie",
                "Madeleine",
                "Mary",
                "Nelly",
                "Olivia",
                "Penny",
                "Pearl",
                "Patsy",
                "Queen",
                "Rebecca",
                "Sandra",
                "Sue-Allen",
                "Tina",
                "Uma",
                "Virginia",
                "Wendy",
                "Yasmine",
                "Zelda",
            ]
        }
        var surnames = [
            "Abdul",
            "Adamson",
            "Activa",
            "Astro",
            "Birmingham",
            "Bush",
            "Bone",
            "Bunting",
            "Clarkson",
            "Cheney",
            "Clarence",
            "Cecil",
            "Desmond",
            "Deastro",
            "Denta",
            "Elijah",
            "Edmonton",
            "Edwards",
            "Eglington",
            "Foxcroft",
            "Fitzpatrick",
            "Ford",
            "Georgia",
            "George",
            "Gerry",
            "Hasbro",
            "Harrison",
            "Harrington",
            "Himper",
            "Ignatius",
            "Ipso",
            "Imple",
            "Jones",
            "Jeffries",
            "Jericho",
            "Kardashian",
            "Kelly",
            "Karr",
            "Luck",
            "Lewis",
            "Lesley",
            "McDonald",
            "McGibbon",
            "Masters",
            "Norton",
            "Nong",
            "Nillsson",
            "Osprey",
            "Olivia",
            "Olivier",
            "Patrick",
            "Percival",
            "Phillips",
            "Paris",
            "Quora",
            "Rammstein",
            "Rottenberg",
            "Rumsfeld",
            "Rockwell",
            "Singh",
            "Stein",
            "Smith",
            "Schweitzer",
            "Turner",
            "Thomson",
            "Tomlington",
            "Ulrich",
            "Ustinov",
            "Vespa",
            "Virginia",
            "Wellington",
            "Washington",
            "Xerxes",
            "Yis",
            "Zest",
        ];
        var genders = ['male','female'];
        var user = {};
        user.gender = getRandom(genders);
        user.firstName = getRandom(firstNames[user.gender]);
        user.lastName = getRandom(surnames);
        user.name = user.firstName+' '+user.lastName;
        user.phone = makeRandomPhoneNumber();
        user.thumb = makeRandomThumbnail(user);
        user.email = makeRandomEmailAddress(user);
        return user;
    }