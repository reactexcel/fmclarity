const s3Config = {
  enabled: function () {
    let enabled = process.env.S3_ENABLED || false;
    if (enabled) {
      return this.account.accessKeyId && this.account.secretAccessKey &&
        this.bucket.name && this.bucket.folder && this.bucket.endpoint;
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
    gridfs: process.env.S3_MIGRATE_GRIDFS || false
  }
};

export default s3Config;