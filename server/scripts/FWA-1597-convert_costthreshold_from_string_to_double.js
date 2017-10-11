


import Requests from '/modules/models/Requests/imports/Requests';
import config from './config';
console.log(config.FWA_1597.enabled)
if (Meteor.isServer && config.FWA_1597.enabled) {
  let requests = Requests.find({});
  let total = requests.count();
  let count = 1;
  console.log('Number of requests ' + total);
  requests.fetch().map((request) => {
    if (request && request._id) {
      let costThreshold = parseFloat(request.costThreshold);
      console.log('item ' + request._id + ' # ' + count + ' / ' + total);
      Requests.collection.update(
        { _id: request._id },
        {
          $set: {
            costThreshold: isNaN(costThreshold) ? 0 : costThreshold
          }
        }
      );
      count++;
    }
  });
}