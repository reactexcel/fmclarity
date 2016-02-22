TestFacilities = {
    clear(excludeIds) {
        Facilities.remove({_id:{$nin:excludeIds}});
    },
    create(profile,team) {
        var item = Facilities.findOne({name:profile.name});
        if(!item) {
            Meteor.call('Facilities.new',profile);
	        item = Facilities.findOne({name:profile.name});
        }
        return item;
    },
    getRandom() {
        var facilities = Facilities.find({}).fetch();
        i = Math.floor(Math.random()*facilities.length);
        return facilities[i];
    }
}