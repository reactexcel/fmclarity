Teams = ORM.Collection("Teams");
Issues = ORM.Collection("Issues");
Facilities = ORM.Collection("Facilities");
Users = ORM.Collection(Meteor.users);

FileMeta = ORM.Collection("Files");

Files = new FS.Collection("File", {
  stores: [new FS.Store.GridFS("master")]
});

FM.collections = {
	'Teams':Teams,
	'Issues':Issues,
	'Facilities':Facilities,
	'Users':Users,
	'users':Users
}