/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";

import { Menu } from '/modules/ui/MaterialNavigation';
import { Requests } from '/modules/models/Requests';
import { ServicesRequestsView } from '/modules/mixins/Services';

import moment from 'moment';


if ( Meteor.isClient ) {
    import Chart from 'chart.js';
}

import Reports from '../Reports.js';
import ProgressArc from '../components/ProgressArc';


/**
 * @class           RequestActivityChart
 * @memberOf        module:features/Reports
 */
const RequestActivityChart = React.createClass( {

    startComputation() {

        this.computation = Tracker.autorun( () => {

            this.updateStats( {
                viewConfig: this.state.viewConfig,
                facilityQuery: facilityQuery = Session.get( 'selectedFacility' ),
                teamQuery: teamQuery = Session.get( 'selectedTeam' )
            } );

        } );

    },

    updateStats( { viewConfig, facilityQuery, teamQuery } ) {

        Meteor.call( 'getRequestActivityStats', {
            viewConfig: viewConfig || this.state.viewConfig,
            facilityQuery: Session.get( 'selectedFacility' ),
            teamQuery: Session.get( 'selectedTeam' )
        }, ( error, results ) => {
            if ( !error ) {
                this.setState( results );
            }
        } )
    },

    componentDidMount() {
        this.resetChart();
        setTimeout( () => { this.startComputation() }, 0 );
    },

    componentWillUnmount() {
        if ( this.computation ) {
            this.computation.stop();
        }
    },

    componentDidUpdate() {
        if ( this.state.openSeries && this.state.closedSeries ) {
            this.updateChart();
        }
    },

    getInitialState() {
        var minimal = this.props.minimal ? this.props.minimal : false;
        return ( {
            viewConfig: {
                format: 'MMM',
                title: "[since] MMMM YYYY",
                startDate: moment().subtract( 2, 'months' ).startOf( 'month' ).toDate(),
                endDate: moment().endOf( 'month' ).toDate(),
            },
            expandall: false,
            minimal: minimal
        } )
    },

    printChart() {
        var component = this;
        component.setState( {
            expandall: true
        } );

        setTimeout( function() {
            window.print();
            component.setState( {
                expandall: false
            } );
        }, 200 );
    },

    getMenu() {
        return [ {
            label: ( "Day" ),
            run: () => {
                let viewConfig = {
                    format: 'hA',
                    title: "dddd Do MMMM",
                    startDate: moment().startOf( 'day' ).toDate(),
                    endDate: moment().endOf( 'day' ).toDate(),
                    groupBy: 'hour'
                }
                this.setState( { viewConfig } );
                this.updateStats( { viewConfig } );
            }
        }, {
            label: ( "Week" ),
            run: () => {
                let viewConfig = {
                    format: 'ddd',
                    title: "for [week starting] Do MMMM",
                    startDate: moment().startOf( 'week' ).toDate(),
                    endDate: moment().endOf( 'week' ).toDate(),
                    groupBy: 'day'
                }
                this.setState( { viewConfig } );
                this.updateStats( { viewConfig } );
            }
        }, {
            label: ( "Month" ),
            run: () => {
                let viewConfig = {
                    format: 'D',
                    title: "MMMM YYYY",
                    startDate: moment().startOf( 'month' ).toDate(),
                    endDate: moment().endOf( 'month' ).toDate(),
                    groupBy: 'day'
                }
                this.setState( { viewConfig } );
                this.updateStats( { viewConfig } );
            }
        }, {
            label: ( "3 Months" ),
            run: () => {
                let viewConfig = {
                    format: 'MMM',
                    title: "[since] MMMM YYYY",
                    startDate: moment().subtract( 2, 'months' ).startOf( 'month' ).toDate(),
                    endDate: moment().endOf( 'month' ).toDate(),
                }
                this.setState( { viewConfig } );
                this.updateStats( { viewConfig } );
            }
        }, {
            label: ( "6 Months" ),
            run: () => {
                let viewConfig = {
                    format: 'MMM',
                    title: "[since] MMMM YYYY",
                    startDate: moment().subtract( 5, 'months' ).startOf( 'month' ).toDate(),
                    endDate: moment().endOf( 'month' ).toDate(),
                }
                this.setState( { viewConfig } );
                this.updateStats( { viewConfig } );
            }
        }, {
            label: ( "Year" ),
            run: () => {
                let viewConfig = {
                    format: 'MMM',
                    title: "YYYY",
                    startDate: moment().startOf( 'year' ).toDate(),
                    endDate: moment().endOf( 'year' ).toDate(),
                    groupBy: 'month',
                }
                this.setState( { viewConfig } );
                this.updateStats( { viewConfig } );
            }
        } ];
    },

    getChartConfiguration() {
        return {
            lineData: {
                labels: this.state.labels || [ '' ],
                datasets: [ {
                    label: "Closed",

                    backgroundColor: "rgba(193,217,245,0.3)",
                    borderColor: "rgba(193,217,245,1)",

                    pointBackgroundColor: "rgba(193,217,245,1)",
                    pointBorderColor: "#fff",

                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",

                    data: this.state.closedSeries || [ 0 ]
                }, {
                    label: "Open",

                    backgroundColor: "rgba(117,170,238,0.3)",
                    borderColor: "rgba(117,170,238,1)",

                    pointBackgroundColor: "rgba(117,170,238,1)",
                    pointBorderColor: "#fff",

                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",

                    data: this.state.openSeries || [ 0 ]
                } ]
            },
            lineOptions: {
                scales: {
                    xAxes: [ {
                        gridLines: {
                            display: false,
                        }
                    } ],
                    yAxes: [ {
                        ticks: {
                            beginAtZero: true
                        }
                    } ]
                }
                /*
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                bezierCurve: true,
                bezierCurveTension: 0.2,
                pointDot: true,
                pointDotRadius: 4,
                pointDotStrokeWidth: 1,
                pointHitDetectionRadius: 20,
                datasetStroke: true,
                datasetStrokeWidth: 1,
                datasetFill: true,
                responsive: true,
                legendTemplate : "<ul class=\"chart-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
                */
            }
        }
    },


    resetChart() {
        var config = this.getChartConfiguration();
        if ( this.chart ) {
            this.chart.destroy();
        }
        var ctx = document.getElementById( "line-chart" ).getContext( "2d" );
        this.chart = new Chart( ctx, {
            type: "line",
            data: config.lineData,
            options: config.lineOptions
        } );
        /*
        if(!this.legend) {
            this.legend = this.chart.generateLegend();
            $('#line-chart-wrapper').append(this.legend);
        }
        */
    },

    updateChart() {
        //for(var i=0;i<this.state.labels.length;i++) {
        this.chart.data.datasets[ 0 ].data = this.state.closedSeries;
        this.chart.data.datasets[ 1 ].data = this.state.openSeries;
        //}
        this.chart.data.labels = this.state.labels;
        this.chart.update();
    },



    render() {
        let { minimal, ready, title } = this.state;

        let facility = Session.get( 'selectedFacility' );

        if ( !minimal ) {

            var statusFilterQuery = [ "Closed", "Deleted", "Complete" ];
            var openQuery = {
                status: { $nin: statusFilterQuery },
            }
            var closedStatusFilter = [ 'Closed', 'Complete' ];
            var closedQuery = {
                status: { $in: closedStatusFilter },
            }

            var team = Session.get( 'selectedTeam' );
            //var team = Teams.findOne({name:"Kaplan Australia Pty Ltd"});
            if ( team ) {
                openQuery[ "team._id" ] = team._id;
                closedQuery[ "team._id" ] = team._id;
            }

            if ( facility ) {
                openQuery[ "facility._id" ] = facility._id;
                closedQuery[ "facility._id" ] = facility._id;
            }
            var buckets = {};
            var requestStatuses = [ 'Open', 'Closed' ];
            var openRequests = Requests.find( openQuery );
            var closedRequests = Requests.find( closedQuery );

            openRequests.map( function( i ) {
                // console.log(i);
                if ( !buckets[ 'Open' ] ) {
                    buckets[ 'Open' ] = [];
                }
                buckets[ 'Open' ].push( i );

            } );

            closedRequests.map( function( i ) {
                if ( !buckets[ 'Closed' ] ) {
                    buckets[ 'Closed' ] = [];
                }
                buckets[ 'Closed' ].push( i );
            } );
        }

        let facilities = null;
        if ( ready ) {
            facilities = Meteor.user().getTeam().getFacilities();
        }

        return (
            <div>

                { !minimal ? 
                <button className="btn btn-flat pull-left noprint" onClick={this.printChart}>
                <i className="fa fa-print" aria-hidden="true"></i>
                </button> 
                : null }

                <Menu items={this.getMenu()}/>
                <div className="ibox-title">
                    <h2>Request activity { title } { facility && facility.name ?" for "+facility.name: (facilities && facilities.length=='1') ? "for "+ facilities[0].name : " for all facilities"}</h2>
                </div>
                <div className="ibox-content">
                    <div className="row">
                        <div className="col-sm-12">
                            <div id="line-chart-wrapper">
                                <canvas id="line-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                { !minimal ?
                <div className = "gragh-table">

                <ServicesRequestsView 
                    requests    = { buckets } 
                    labels      = { requestStatuses } 
                    expandall   = { this.state.expandall }
                />

                </div>
                : null }

            </div>
        )
    }

} );

export default RequestActivityChart;
