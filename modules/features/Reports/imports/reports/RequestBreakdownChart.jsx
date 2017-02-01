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

/**
 * @class 			RequestBreakdownChart
 * @memberOf 		module:features/Reports
 */
const RequestBreakdownChart = React.createClass( {

    updateStats( { startDate } ) {

        Meteor.call( 'getRequestBreakdownStats', {
            startDate: startDate,
            facilityQuery: Session.get( 'selectedFacility' ),
            teamQuery: Session.get( 'selectedTeam' )
        }, ( error, results ) => {
            console.log( { error, results } );
            if ( !error ) {
                this.setState( results );
            }
        } )
    },

    getInitialState() {
        let startDate = moment().subtract( 2, 'months' ).startOf( 'month' ),
            title = startDate.format( "[since] MMMM YYYY" ),
            minimal = this.props.minimal ? this.props.minimal : false;

        return ( {
            startDate: startDate.toDate(), //cannot send moment obj through method
            title: title,
            expandall: false,
            minimal: minimal
        } )
    },


    componentDidMount() {
        this.resetChart();
        this.updateStats( { startDate: this.state.startDate } );
    },

    componentDidUpdate() {
        if ( this.state.set ) {
            this.updateChart();
        }
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
                var startDate = moment().startOf( 'day' );
                var title = startDate.format( "[on] dddd Do MMMM" )
                this.setState( {
                    startDate: startDate,
                    title: title
                } )
            }
        }, {
            label: ( "Week" ),
            run: () => {
                var startDate = moment().startOf( 'week' );
                var title = startDate.format( "[for week starting] Do MMMM" )
                this.setState( {
                    startDate: startDate,
                    title: title
                } )
            }
        }, {
            label: ( "Month" ),
            run: () => {
                var startDate = moment().startOf( 'month' );
                var title = startDate.format( "[for] MMMM YYYY" )
                this.setState( {
                    startDate: startDate,
                    title: title
                } )
            }
        }, {
            label: ( "3 Months" ),
            run: () => {
                var startDate = moment().subtract( 2, 'months' ).startOf( 'month' );
                var title = startDate.format( "[since] MMMM YYYY" )
                this.setState( {
                    startDate: startDate,
                    title: title
                } )
            }
        }, {
            label: ( "6 Months" ),
            run: () => {
                var startDate = moment().subtract( 5, 'months' ).startOf( 'month' );
                var title = startDate.format( "[since] MMMM YYYY" )
                this.setState( {
                    startDate: startDate,
                    title: title
                } )
            }
        }, {
            label: ( "Year" ),
            run: () => {
                var startDate = moment().startOf( 'year' );
                var title = startDate.format( "YYYY" )
                this.setState( {
                    startDate: startDate,
                    title: title
                } )
            }
        } ];
    },

    getChartConfiguration() {
        //console.log(this.state);
        return {
            barData: {
                labels: this.state.labels || [ '' ],
                datasets: [ {
                    backgroundColor: "rgba(117,170,238,0.8)",
                    borderColor: "rgba(117,170,238,1)",
                    hoverBackgroundColor: "rgba(117,170,238,0.5)",
                    hoverBorderColor: "rgba(117,170,238,1)",
                    data: this.state.set || [ 0 ]
                } ]
            },
            barOptions: {
                scales: {
                    xAxes: [ {
                        gridLines: {
                            //offsetGridLines:false,
                        },
                        ticks: {
                            //fontSize:10,
                            autoSkip: false,
                        }
                    } ],
                    yAxes: [ {
                        ticks: {
                            beginAtZero: true
                        }
                    } ]
                },
                legend: {
                    display: false
                }
                /*                
                scaleBeginAtZero: true,
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                barShowStroke: true,
                barStrokeWidth: 1,
                barValueSpacing: 5,
                barDatasetSpacing: 1,
                responsive: true
                */
            }
        }

    },

    resetChart() {
        var config = this.getChartConfiguration();
        if ( this.chart ) {
            this.chart.destroy();
        }
        var ctx = document.getElementById( "bar-chart" ).getContext( "2d" );
        this.chart = new Chart( ctx, {
            type: 'bar',
            data: config.barData,
            options: config.barOptions
        } );
    },

    updateChart() {
        this.chart.data.datasets[ 0 ].data = this.state.set;
        this.chart.data.labels = this.state.labels;
        this.chart.update();
    },

    render() {
        let { facility, minimal, labels, expandall, set, title } = this.state,
        	buckets = null,
            facilities = null;

        if ( set ) {
            facilities = Meteor.user().getTeam().getFacilities();
        }

        return (
            <div>

				{!minimal ? 
				<button className="btn btn-flat pull-left noprint"  onClick={this.printChart}>
				<i className="fa fa-print" aria-hidden="true"></i>
				</button> 
				: null}

				<Menu items = { this.getMenu() }/>

				<div className="ibox-title">
					<h2>Request breakdown {title} {facility && facility.name?" for "+facility.name: (facilities && facilities.length=='1') ? "for "+ facilities[0].name : " for all facilities"}</h2>
				</div>

				<div className="ibox-content">
					<div>
						<canvas id="bar-chart"></canvas>
					</div>
				</div>

				{ !minimal ? 
				<div className="gragh-table">

				<ServicesRequestsView 
					requests 	= { buckets } 
					labels 		= { labels } 
					expandall 	= { expandall }
				/>

				</div>
				: null}

			</div>
        )
    }

} );

export default RequestBreakdownChart;
