function getRandom(items) {
    var i = Math.floor(Math.random()*items.length);        
    return items[i];
}

TestTeams = {
    thumbs:[],
    makeThumbs() {
        this.thumbs.length = 0;
        for(var i=1;i<=11;i++) {
            var url = Meteor.absoluteUrl()+'/test/logos/'+i+'.png';
            Files.insert(url, function (error, fileObj) {
                if(!error) {
                    TestTeams.thumbs.push({
                        _id:fileObj._id
                    });
                }
            });
        }
    },    
    clear(excludeIds) {
        Teams.remove({_id:{$nin:excludeIds}});
    },
    create(profile,shouldAddUsers) {
        var team = Teams.findOne({name:profile.name});
        if(!team) {
            profile.thumb = getRandom(TestTeams.thumbs);
            Meteor.call('Teams.create',profile);
	        team = Teams.findOne({name:profile.name});
        }
        return team;
    },
    createContractors(num){
        for(var i=0;i<num;i++) {
            var newUser = makeRandomUser();
            Meteor.call('Users.create',newUser);
        }
    },
    getRandomMember(team) {
        var members = team.getMembers();
        var i = Math.floor(Math.random()*members.length);
        return members[i];    	
    }

}