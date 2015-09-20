Schemas = {};

Books = new Mongo.Collection('books');


if (Meteor.isClient) {
  //Meteor.subscribe('books');

  //Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    //React.render(<App />, document.getElementById("render-target"));
  //});
}

if (Meteor.isServer) {
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('books', function () {
    return Books.find();
  });
}

Schemas.Books = new SimpleSchema({
    address: {
        type: String,
        label: "Address",
        max: 200
    },
    field2: {
        type: String,
        label: "Field 2"
    },
    field3: {
        type: Number,
        label: "Field 3",
        min: 0
    },
    field4: {
        type: Date,
        label: "Field 4",
        optional: true
    },
    summary: {
        type: String,
        label: "Summary",
        optional: true,
        max: 1000
    }
});

Books.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

//Books.attachSchema(Schemas.Books);

Books.helpers({

});


Meteor.methods({
 "Book.upsert": function(item) {
    Books.upsert(item._id, {$set: _.omit(item, '_id')});
  },
  "Book.destroy":function(item) {
    Books.remove(item._id);
  }
})
/*
Books.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
*/