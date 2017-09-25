/**
 * @see https://fmclarity.atlassian.net/browse/FWA-1568
 * Purpose of the script is to:
 * 1. Move existing Preventative type requests from PPM_Schedulers collection into the Issues collection
 * 2. Change verbiage of PPM_Schedulers type from Schedulars to Schedulers
 *
 * This script runs at build time
 */

import PPM_Schedulers from '/modules/models/Requests/imports/PPM_Schedulers';
import Requests from '/modules/models/Requests/imports/Requests';
import config from './config';

if (Meteor.isServer && config.FWA_1568.enabled) {
  PPM_Schedulers.find({
    type: 'Preventative'
  }).fetch().map((request) => {
    if (request && request._id) {
      let requestExists = Requests.findOne(request._id);
      if (!requestExists) {
        Requests.collection.insert(request);
      }
      PPM_Schedulers.remove(request._id);
    }
  });

  PPM_Schedulers.find({
    type: 'Schedular',
    // status: 'PPM'
  }).fetch().map((request) => {
    PPM_Schedulers.collection.update(request._id, {
      $set: { type: 'Scheduler' }
    });
  });
}