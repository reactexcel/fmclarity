import { Meteor } from 'meteor/meteor';
import CronJobs from "./cronJobs.js";
import CheckCronsAccessability from '/modules/config/CheckCronsAccessability.js';
//import { FlowRouter } from 'meteor/kadira:flow-router-ssr';

Meteor.startup( function() {
    let smtpUsername = "AKIAIPJKWHGNFC75EL3Q",
        smtpPassword = "AjuszCYXste2nI8Y8SrH+3vpo0+4lCJ0KA4HtBUAgd0m";
    process.env.ROOT_URL = 'https://app.fmclarity.com';
    process.env.MAIL_URL = "smtps://" + smtpUsername + ":" + encodeURIComponent( smtpPassword ) + "@email-smtp.us-west-2.amazonaws.com:465/";

    SyncedCron.config( {
        log: true,
        logger: null,
        collectionName: 'cronHistory',
        utc: false,
        collectionTTL: 172800
    } );

    SyncedCron.add( {
        name: 'Issue PPM Request',
        schedule: function( parser ) {
            return parser.text( "at 09:00 am" );
        },
        job: CronJobs.issuePPM_Schedulers,
    } );

    SyncedCron.add( {
        name: 'Send Email Digests',
        schedule: function( parser ) {
            return parser.text('every 1 hour');
        },
        job: CronJobs.sendEmailDigests,
    } );

    if(CheckCronsAccessability.complete_booking_request_checks.enabled == true ){
        SyncedCron.add( {
            name: 'Complete Booking Request',
            schedule: function( parser ) {
                return parser.text('every 5 minute');
            },
            job: CronJobs.completeBookingRequest,
        } );
    }

    SyncedCron.start();
    import './scripts/MigrateGFStoS3';
    import './scripts';
} );

FM.inDevelopment = function() {
    return process.env.NODE_ENV === "development" || process.env.METEOR_ENV === "development";
};
FM.inProduction = function() {
    return process.env.METEOR_ENV === "production";
};

//console.log( process.env );

//var timeInMillis = 1000 * 10; // 10 secs
//FlowRouter.setPageCacheTimeout( timeInMillis );
//FlowRouter.setDeferScriptLoading( true );
