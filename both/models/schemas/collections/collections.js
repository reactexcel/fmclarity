Teams = ORM.Collection("Teams");
Issues = ORM.Collection("Issues");
Facilities = ORM.Collection("Facilities");
Messages = ORM.Collection("Messages");
Users = ORM.Collection(Meteor.users);

Files = new FS.Collection("File", {
  stores: [new FS.Store.GridFS("master")]
});