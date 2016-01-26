TestTeams = {
    clear(excludeIds) {
        Teams.remove({_id:{$nin:excludeIds}});
    },
    create(profile,shouldAddUsers) {
        var team = Teams.findOne({name:profile.name});
        if(!team) {
            Meteor.call('Team.new',profile);
	        team = Teams.findOne({name:profile.name});
        }
        return team;
    },
    createContractors(num){
        for(var i=0;i<num;i++) {
            var newUser = makeRandomUser();
            Meteor.call('User.new',newUser);
        }
    },
    getRandomMember(team) {
        var members = team.getMembers();
        var i = Math.floor(Math.random()*members.length);
        return members[i];    	
    }

}