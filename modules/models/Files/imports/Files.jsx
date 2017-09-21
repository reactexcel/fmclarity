/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

/**
 * @memberOf        modules:models/Files
 */

import s3Config, {  } from '/modules/config/s3';
let stores = [];
if (s3Config.enabled()) {
  const s3Store = new FS.Store.S3("s3Images", {
    accessKeyId: s3Config.account.accessKeyId,
    secretAccessKey: s3Config.account.secretAccessKey,
    bucket: s3Config.bucket.name,
    folder: s3Config.bucket.folder,
    endpoint: s3Config.bucket.endpoint
  });
  stores.push(s3Store);
} else {
  stores.push(new FS.Store.GridFS("master"));
}

if (s3Config.migrate.gridfs.enabled && s3Config.enabled()) {
  stores.push(new FS.Store.GridFS("master"));
}

const Files = new FS.Collection("File", {
  stores: stores
});

if (Meteor.isServer && s3Config.migrate.gridfs.enabled && s3Config.enabled()) {
  let query = {
    'copies.s3Images.size': { $gt: s3Config.migrate.gridfs.all ? -1: 0 },
    'copies.master.size': { $gt: 0 }
  };
  Files.find(query).forEach(function (fileObj) {
      let readStream = fileObj.createReadStream('master');
      let writeStream = fileObj.createWriteStream('s3Images');
      readStream.pipe(writeStream);
  });
}

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
