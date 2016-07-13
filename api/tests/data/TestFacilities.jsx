function getRandom(items) {
    var i = Math.floor(Math.random()*items.length);        
    return items[i];
}

TestFacilities = {
    thumbs:[],
    currentThumb:-1,
    makeThumbs() {
        this.thumbs.length = 0;
        for(var i=1;i<=25;i++) {
            var url = Meteor.absoluteUrl()+'test/facilities/'+i+'.jpg';
            Files.insert(url, function (error, fileObj) {
                if(!error) {
                    TestFacilities.thumbs.push({
                        _id:fileObj._id
                    });
                }
            });
        }
    }, 
    getThumb() {
        this.currentThumb++;
        if(this.currentThumb>this.thumbs.length) {
            this.currentThumb = 0;
        }
        return this.thumbs[this.currentThumb];
    },
    clear(excludeIds) {
        Facilities.remove({_id:{$nin:excludeIds}});
    },
    create(profile,team) {
        var item = Facilities.findOne({name:profile.name});
        if(!item) {
            Meteor.call('Facilities.create',profile);
	        item = Facilities.findOne({name:profile.name});
        }
        item.thumb = getRandom(TestFacilities.thumbs);
        return item;
    },
    getRandom() {
        var facilities = Facilities.find({}).fetch();
        i = Math.floor(Math.random()*facilities.length);
        return facilities[i];
    }
}