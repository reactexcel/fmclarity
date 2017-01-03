import { Mongo } from 'meteor/mongo';
import moment from 'moment';

const CronJobs = {
  issuePPMRequest(){
    import { Requests } from '/modules/models/Requests';
    import { Teams } from '/modules/models/Teams';
    let collection = Requests.collection,
        requestsCursor = collection.find( { type: "Preventative" } ),
        requests = requestsCursor.fetch();

    requests.forEach( ( request, i ) => {
    let team = Teams.collection.findOne( { _id: request.team._id } ),
        coopyRequest = Object.assign( {}, request )
        code = null,
        nextDueDate = null;
      if ( request.frequency ) {
          let dueDate = moment( request.dueDate ),
            repeats = parseInt( request.frequency.repeats ),
            period = {};

          period[ request.frequency.unit ] = parseInt( request.frequency.number );
          for ( var i = 0; i < repeats; i++ ) {

            if( dueDate.isAfter() ) {
              nextDueDate = dueDate.toDate();
              break;
            }
            dueDate = dueDate.add( period );
          }
          if(!nextDueDate){
            nextDueDate = dueDate.toDate();
          }
      }

      if( !request.lastIssedRequest ||
            ( moment(nextDueDate).format("YYYY-MM-DD") === moment().add(7,'d').format("YYYY-MM-DD") &&
               moment(nextDueDate).isAfter( request.lastIssedRequest ) ) ){

        if(team){
         code = team.getNextWOCode();
        }

        coopyRequest = _.omit(coopyRequest, "_id" );
        coopyRequest.dueDate =  nextDueDate;
        coopyRequest.status = "Issued";
        coopyRequest.code = code;
        coopyRequest.type = 'Ad-Hoc';

        console.log("Issued WO#",coopyRequest.code,": id -> ", request._id );
        collection.insert(coopyRequest);
        collection.update( { "_id": request._id },{ $set: { "lastIssedRequest": nextDueDate } } )
      }
    } );
  },
}

 export default CronJobs;
