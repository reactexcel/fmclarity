const s3Config = {
  enabled: function () {
    let enabled = process.env.S3_ENABLED === 'true';

    if (enabled) {
      return (Boolean(enabled) &&
        !_.isEmpty(this.account.accessKeyId) &&
        !_.isEmpty(this.account.secretAccessKey) &&
        !_.isEmpty(this.bucket.name) &&
        !_.isEmpty(this.bucket.folder) &&
        !_.isEmpty(this.bucket.endpoint)
      );
    }
    return enabled;
  },
  account: {
    accessKeyId: process.env.S3_ACCOUNT_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCOUNT_SECRET_ACCESS_KEY
  },
  bucket: {
    name: process.env.S3_BUCKET_NAME,
    folder: process.env.S3_BUCKET_FOLDER,
    endpoint: process.env.S3_BUCKET_ENDPOINT
  },
  migrate: {
    gridfs: {
      enabled: process.env.S3_MIGRATE_GRIDFS === 'true',
      all: process.env.S3_MIGRATE_GRIDFS_ALL === 'true'
    }
  },
};

export default s3Config;