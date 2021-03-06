TestIssues = {
    clear(excludeIds) {
        Issues.remove({_id:{$nin:excludeIds}});
    },
    create(args) {
    	var facility,shouldAssignRandomOwner;
    	facility = args.facility;
    	shouldAssignRandomOwner = args.shouldAssignRandomOwner;

    	issue = TestIssueGenerator.generate({
    		facility:facility
    	});

		if(facility&&shouldAssignRandomOwner) {
            var owner = TestTeams.getRandomMember(facility.getTeam());
            issue.setOwner(owner);
		}
		return issue;
    },
    getRandomCreationDate() {
		var startDate;
		var chance = Math.random();
		if(chance<0.1) {
			startDate = new Date(2014,0,1);
		}
		else if(chance<0.3) {
			startDate = new Date(2015,11,1);
		}
		else {
			startDate = new Date(2016,0,1);
		}
		return randomDate(startDate, new Date());
    },
    getRandomTitleAndDescription:getRandomTitleAndDescription,
    getRandomPriority:function(request) {
		return request.status=='Closed'?'Closed':getRandom(['Scheduled','Standard','Urgent','Critical'])
    }
}

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

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandom(items) {
    var i = Math.floor(Math.random()*items.length);        
    return items[i];
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomLevelAndArea(facility) {

}

function getRandomServiceAndSubservice(facility) {

}

function selectRandomContractor(issue) {

}

TestIssueGenerator = {
	objects:[
		"air conditioner",
		"automatic door",
		"ceiling",
		"ceiling fan",
		"chiller",
		"cabinet",
		"coffee machine",
		"dishwasher",
		"door",
		"elevator",
		"escalator",
		"electric door",
		"emergency alarm",
		"fire extinguisher",
		"floor",
		"fire alarm",
		"generator",
		"heater",
		"hand drier",
		"intercom",
		"light",
		"light switch",
		"night light",
		"projector",
		"roof",
		"sink",
		"switchboard",
		"seat",
		"toilet",
		"water pipe",
		"wall",
		"whiteboard"
	],
	locations:[
		"board room",
		"balcony",
		"boiler room",
		"basement",
		"bar",
		"bathroom",
		"cloak room",
		"foyer",
		"hallway",
		"kitchen",
		"kitchenette",
		"level 1 work room",
		"level 2 work room",
		"level 3 bathroom",
		"main office",
		"reception",
		"rooftop garden",
		"seminar room",
		"session room",
	],
	problems:[
		"is broken",
		"is buzzing",
		"is cracked",
		"is damp",
		"is leaking",
		"is mouldy",
		"is not working",
		"is not functional",
		"requires service",
		"is sparking",
		"is smoking",
		"is wet",
		"won't switch on",
		"won't switch off",
		"has stains all over it",
		"intermittently fails",
	],
	title:[
		/*"third [object] from the left [problem1]",
		"[object] in the [location]",
		"every [object] in the [location] [problem1]",*/
		"[location] [object]",
		"[object] [problem1]",
		//"[object] [problem1] and [problem2]",
		//"[location] : [object] [problem1] and [problem2]",
		//"[object] [problem1] in [location]",
		//"[location] is unusable due to [object]!",
		"[object] [problem1]",
		//"[object]/[location]/[problem1] and [problem3]",
		"[location] [object] [problem1]",
	],
	description:[
		"The [object] [problem1] and assistance is required.",
		"The [object] [problem1] and [problem2].",
		"Ask at reception for further instructions.",
		"Protective clothing may be required.",
		"The [object] was replaced just [number] months ago but now it [problem1] and sometimes [problem2].",
		"It [problem1].",
		"The usual steps have been taken to address this issue but they haven't worked.",
		"It has happened [number] times before.",
		"People are starting to to worry about the [object] which [problem1].",
		"Nobody can enter the [location] as a consequence.",
		"The [object] [problem1], [problem2] and [problem3]!",
		"The [location] is unusable until this problem is fixed.",
		"Problems: [object] [problem1], [problem2] and [problem3].",
		"When I go into the [location] I notice that the [object] [problem1].",
		"It started [number] months ago after the [object] was replaced.",
		"It's in room number [number].",
		"It's down the hallway, second door on the right.",
	],
	status:[
		"New",
		/*"Issued",
		"Closed"*/
	]
};

function getRandomTitleAndDescription() {
	var object = getRandom(TestIssueGenerator.objects);
	var location = getRandom(TestIssueGenerator.locations);
	var title = getRandom(TestIssueGenerator.title);
	var descriptions = shuffle(TestIssueGenerator.description);
	var numDescriptionLines = Math.floor(Math.random()*8)+2;
	var descriptionLines = [];
	for(var i=0;i<numDescriptionLines;i++) {
		descriptionLines.push(
			capitalize(descriptions[i])
		);
	}
	var descriptionPart1 = descriptionLines.join(' ');
	//descriptionLines = descriptionLines.reverse();
	//var descriptionPart2 = descriptionLines.join(' ');
	var description = descriptionPart1;//+"\n\n"+descriptionPart2;
	var problems = shuffle(TestIssueGenerator.problems);
	var problem1 = problems[0];
	var problem2 = problems[1];
	var problem3 = problems[2];

	description = description.replace(/\[problem1\]/g,problem1);
	description = description.replace(/\[problem2\]/g,problem2);
	description = description.replace(/\[problem3\]/g,problem3);
	description = description.replace(/\[location\]/g,location);
	description = description.replace(/\[object\]/g,object);
	description = description.replace(/\[number\]/g,function(){
		return Math.floor(Math.random()*10)+2;
	});

	title = title.replace(/\[problem1\]/g,problem1);
	title = title.replace(/\[problem2\]/g,problem2);
	title = title.replace(/\[problem3\]/g,problem3);
	title = title.replace(/\[location\]/g,location);
	title = title.replace(/\[object\]/g,object);
	title = title.replace(/\[number\]/g,function(){
		return Math.floor(Math.random()*10)+2;
	});

	return {
		name:capitalize(title),
		description:capitalize(description)
	}
}