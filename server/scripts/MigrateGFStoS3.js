import s3Config from '/modules/config/s3';
import Files from '/modules/models/Files/imports/Files';
import { Mongo } from 'meteor/mongo';


if (Meteor.isServer && s3Config.migrate.gridfs.enabled && s3Config.enabled()) {
  let FileMigration = new Mongo.Collection('fileMigration');
  FileMigration.schema = {
      s3Bucket: {
        name: { type: String },
        folder: { type: String }
      },
      fsId: {type: String},
      importDate: {type: Date, default: Date.now()}
    };

  let query = {
    'copies.s3Images.size': { $gt: s3Config.migrate.gridfs.all ? -1: 0 },
    'copies.master.size': { $gt: 0 }
  };
  let files = Files.find(query).fetch();

  // store all streams into the streams array
  let streams = [];
  for (let file of files) {
    let fileMigrationEntryCount = FileMigration.find({fsId: file._id, 's3Bucket.name': s3Config.bucket.name,
      's3Bucket.folder': s3Config.bucket.folder}).count();
    if (fileMigrationEntryCount === 0) {
      let readStream = file.createReadStream('master');
      let writeStream = file.createWriteStream('s3Images');
      streams.push({
        id: file._id,
        read: readStream,
        write: writeStream
      });
    }
  }

  // recursively pipe all stored streams
  if (streams.length > 0) {
    pipeStreamsRecursive(streams, 0);
  }

  function pipeStreamsRecursive(streams, index) {
    if (!streams[index]) {
      return false;
    }

    let stream = streams[index].read.pipe(streams[index].write);
    // recursively call self after the stream has been finished to simulate synchronous functionality
    stream.on('finish', Meteor.bindEnvironment(function () {
      // save streamed file into the database for future migration reference
      FileMigration.upsert({
        fsId: streams[index].id,
        s3Bucket: {
          name: s3Config.bucket.name,
          folder: s3Config.bucket.folder
        }
      },{
        fsId: streams[index].id,
        s3Bucket: {
          name: s3Config.bucket.name,
          folder: s3Config.bucket.folder
        }
      });
      console.log('Migrated file # ' + index + ' with the id: ' + streams[index].id);
      index = index + 1;
      pipeStreamsRecursive(streams, index);
    }));
  }
}


