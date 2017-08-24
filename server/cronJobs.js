import { Mongo } from 'meteor/mongo';
import moment from 'moment';


function getMessagesThisHour( user ) {

    import { Messages } from '/modules/models/Messages';

    let oneHourAgo = moment().subtract( 1, 'hour' );

    let messages = Messages.findAll( {
        'inboxId.query._id': user._id,
        digest: { $ne: false },
        createdAt: { $gte: oneHourAgo.toDate() }
    }, { sort: { createdAt: 1 } } );

    return messages;
}


const CronJobs = {

    sendEmailDigests() {
        import { Users } from '/modules/models/Users';
        import { EmailDigestView } from '/modules/core/Email';

        let users = Users.findAll();
        if ( !users || !users.length ) {
            console.log( 'no users found' );
        } else {
            users.map( ( user ) => {
                let messages = getMessagesThisHour( user );
                if( !messages || !messages.length ) {
                    console.log( `no notifications for ${user.profile.name}` );
                }
                else {
                    let messageBody = DocMessages.render( EmailDigestView, { user, messages } );
                    Meteor.call( 'Messages.sendEmail', user, {
                        subject: 'FM Clarity Updates',
                        emailBody: messageBody
                    } );
                }
            } )
        }
    },

    issuePPM_Schedulers() {
        import { PPM_Schedulers } from '/modules/models/Requests';
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

                    if ( dueDate.isAfter() ) {
                        nextDueDate = dueDate.toDate();
                        break;
                    }
                    dueDate = dueDate.add( period );
                }
                if ( !nextDueDate ) {
                    nextDueDate = dueDate.toDate();
                }
            }

            if ( !request.lastIssedRequest ||
                ( moment( nextDueDate ).format( "YYYY-MM-DD" ) === moment().add( 7, 'd' ).format( "YYYY-MM-DD" ) &&
                    moment( nextDueDate ).isAfter( request.lastIssedRequest ) ) ) {

                if ( team ) {
                    code = team.getNextWOCode();
                }

                coopyRequest = _.omit( coopyRequest, "_id" );
                coopyRequest.dueDate = nextDueDate;
                coopyRequest.status = "Issued";
                coopyRequest.code = code;
                coopyRequest.type = 'Preventative';

                console.log( "Issued WO#", coopyRequest.code, ": id -> ", request._id );
                collection.insert( coopyRequest );
                collection.update( { "_id": request._id }, { $set: { "lastIssedRequest": nextDueDate } } )
            }
        } );
    },
}

export default CronJobs;
