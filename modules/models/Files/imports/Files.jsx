/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

/**
 * @memberOf        modules:models/Files
 */

import s3Config from '/modules/config/s3';
let stores = [];

let s3Options = {
  accessKeyId: s3Config.account.accessKeyId,
  secretAccessKey: s3Config.account.secretAccessKey,
  bucket: s3Config.bucket.name,
  folder: s3Config.bucket.folder,
  endpoint: s3Config.bucket.endpoint
};

if (Meteor.isServer) {
  if (s3Config.enabled()) {
    if (!s3Config.migrate.gridfs.enabled) {
      stores.push(new FS.Store.S3("s3Images", s3Options));
    } else if (s3Config.migrate.gridfs.enabled) {
      stores.push(new FS.Store.S3("s3Images", s3Options));
      stores.push(new FS.Store.GridFS("master"));
    }
  }
}

if (Meteor.isClient) {
  stores.push(new FS.Store.S3("s3Images"));
}

const Files = new FS.Collection("File", {
  stores: stores
});

if ( Meteor.isServer ) {
    Files.allow( {
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            return true;
        },
        'remove': function() {
            return true;
        },
        'download': function() {
            return true;
        }
    } );
}

if ( Meteor.isServer ) {

    Meteor.publish( 'Files', () => {
        /*Uncomment this and comment out returning the cursor to see publication issue*/

        // var self = this;

        // var handle = Files.find().observe({
        //     added: function (document) {
        //         self.added('images', document._id, document);
        //     },
        //     changed: function (document) {
        //         self.changed('images', document._id, document);
        //     },
        //     removed: function (document) {
        //         self.removed('images', document._id);
        //     }
        // });

        // self.onStop(function () {
        //     handle.stop();
        // });

        /*Comment this out and Uncomment manual publishing to see publication issue*/

        return Files.find();
    } );
}

export default Files
