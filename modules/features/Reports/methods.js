
import { Requests } from '/modules/models/Requests';
import moment from 'moment';


Meteor.methods( {
    getProgressOverviewStats( { startDate, endDate, period, facilityQuery, teamQuery } ) {
        let baseQuery = {},
            queries = {
                New: { thisPeriod: 0, lastPeriod: 0 },
                Issued: { thisPeriod: 0, lastPeriod: 0 },
                Complete: { thisPeriod: 0, lastPeriod: 0 },
            };

        if ( startDate ) {
            startDate = moment( startDate );
        }
        if ( endDate ) {
            endDate = moment( endDate );
        }
        if ( facilityQuery ) {
            baseQuery[ "facility._id" ] = facilityQuery._id;
        }
        if ( teamQuery ) {
            baseQuery[ "team._id" ] = teamQuery._id;
            let lastStartDate = startDate.clone().subtract( period.number, period.unit + 's' );
            let lastEndDate = endDate.clone().subtract( period.number, period.unit + 's' );
            for ( let status in queries ) {
                let qThisMonth = _.extend( {}, baseQuery, {
                    status: status,
                    createdAt: {
                        $gte: startDate.toDate(),
                        $lte: endDate.toDate()
                    }
                } );
                let qLastMonth = _.extend( {}, baseQuery, {
                    status: status,
                    createdAt: {
                        $gte: lastStartDate.toDate(),
                        $lte: lastEndDate.toDate()
                    }
                } );
                queries[ status ].thisPeriod = Requests.find( qThisMonth ).count();
                queries[ status ].lastPeriod = Requests.find( qLastMonth ).count();
            }
        }
        return queries;
    }
} )
