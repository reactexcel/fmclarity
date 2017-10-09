import { RequestSearch, Requests } from '/modules/models/Requests';
import moment from 'moment';


Meteor.methods( {
    getProgressOverviewStats({startDate, endDate, period, facilityQuery, teamQuery}) {
      if (Meteor.isServer) {
        this.unblock();

        let baseQuery = {
          'team._id': teamQuery._id
        };
        let queries = {
          New: {thisPeriod: 0, lastPeriod: 0},
          Issued: {thisPeriod: 0, lastPeriod: 0},
          Complete: {thisPeriod: 0, lastPeriod: 0},
        };

        let dateFields = {
          New: 'createdAt',
          Issued: 'issuedAt',
          Complete: 'closeDetails.completionDate'
        };

        if (startDate) {
          startDate = moment(startDate);
        }
        if (endDate) {
          endDate = moment(endDate);
        }
        if (facilityQuery) {
          baseQuery["facility._id"] = facilityQuery._id;
        }
        if (teamQuery) {
          baseQuery["team._id"] = teamQuery._id;
          let lastStartDate = startDate.clone().subtract(period.number, period.unit + 's');
          let lastEndDate = endDate.clone().subtract(period.number, period.unit + 's');
          for (let status in queries) {
            let qThisMonth = _.extend({}, baseQuery, {
              [dateFields[status]]: {
                $gte: startDate.toDate(),
                $lte: endDate.toDate()
              }
            });
            let qLastMonth = _.extend({}, baseQuery, {
              [dateFields[status]]: {
                $gte: lastStartDate.toDate(),
                $lte: lastEndDate.toDate()
              }
            });
            queries[status].thisPeriod = Requests.find(qThisMonth).count();
            queries[status].lastPeriod = Requests.find(qLastMonth).count();
          }
        }
        console.log(queries);
        return queries;
      }
    },

    getRequestActivityStats( { viewConfig, teamQuery, facilityQuery } ) {

        this.unblock();

        viewConfig.startDate = moment( viewConfig.startDate );
        viewConfig.endDate = moment( viewConfig.endDate );


        let openQuery = { status: { $ne: 'Complete' } },
            closedQuery = { status: 'Complete' };

        if ( teamQuery ) {
            openQuery[ "team._id" ] = teamQuery._id;
            closedQuery[ "team._id" ] = teamQuery._id;
        }

        if ( facilityQuery ) {
            openQuery[ "facility._id" ] = facilityQuery._id;
            closedQuery[ "facility._id" ] = facilityQuery._id;
        }

        let open = RequestSearch.searchByDate( { q: openQuery, config: viewConfig } ),
            closed = RequestSearch.searchByDate( { q: closedQuery, config: viewConfig } );

        return {
            openSeries: open.sets,
            closedSeries: closed.sets,
            labels: open.labels,
            title: viewConfig.startDate.format( viewConfig.title )
        }
    },

    getRequestBreakdownStats( { startDate, teamQuery, facilityQuery } ) {

        this.unblock();

        var query = {
            createdAt: {
                $gte: startDate
            }
        }

        if ( teamQuery ) {
            query[ 'team._id' ] = teamQuery._id;
        }

        if ( facilityQuery ) {
            query[ 'facility._id' ] = facilityQuery._id;
        }

        let requests = Requests.find( query );

        let buckets = {},
            costs = {},
            labels = [],
            counts = [],
            set = [];

        requests.map( function( request ) {
            var serviceName;
            if ( request.service && request.service.name ) {
                serviceName = request.service.name;
                if ( serviceName.length > 15 ) {
                    serviceName = serviceName.substring( 0, 13 ) + '...';
                }
                if ( !costs[ serviceName ] ) {
                    costs[ serviceName ] = 0;
                }
                if ( !buckets[ serviceName ] ) {
                    labels.push( serviceName );
                    buckets[ serviceName ] = [];
                }
                buckets[ serviceName ].push( request );
                var newCost = parseInt( request.costThreshold );
                if ( _.isNaN( newCost ) ) {
                    newCost = 0;
                }
                costs[ serviceName ] += newCost;
            }
        } );
        labels.map( function( serviceName, idx ) {
            counts[ idx ] = buckets[ serviceName ].length;
            set[ idx ] = costs[ serviceName ];
        } );

        return {
            facility: facilityQuery,
            labels: labels,
            set: set, //costs//counts
            buckets: buckets,
            //ready: handle.ready()
        }
    }

} )
