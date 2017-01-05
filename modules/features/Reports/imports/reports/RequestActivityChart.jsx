/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/modules/ui/MaterialNavigation';
import { RequestSearch, Requests } from '/modules/models/Requests';
import { ServicesRequestsView } from '/modules/mixins/Services';

import moment from 'moment';


if ( Meteor.isClient ) {
	import Chart from 'chart.js';
}

import Reports from '../Reports.js';
import ProgressArc from '../components/ProgressArc';


/**
 * @class 			RequestActivityChart
 * @memberOf 		module:features/Reports
 */
const RequestActivityChart = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {

		var openQuery = {status:{$ne:'Closed'},}
		var closedQuery = {
			status: "Closed",
		}

		var team = Session.get( 'selectedTeam' );
		//var team = Teams.findOne({name:"Kaplan Australia Pty Ltd"});
		if ( team ) {
			openQuery[ "team._id" ] = team._id;
			closedQuery[ "team._id" ] = team._id;
		}

		var facility = Session.get( 'selectedFacility' );
		if ( facility ) {
			openQuery[ "facility._id" ] = facility._id;
			closedQuery[ "facility._id" ] = facility._id;
		}
		

		var viewConfig = this.state.viewConfig;
		var open = RequestSearch.searchByDate( { q: openQuery, config: viewConfig } );
		var closed = RequestSearch.searchByDate( { q: closedQuery, config: viewConfig } );

		

		var labels = open.labels;
		var title = viewConfig.startDate.format( viewConfig.title );

		return {
			facility: facility,
			openSeries: open.sets,
			closedSeries: closed.sets,
			openQuery: openQuery,
			labels: labels,
			title: title,
			closedQuery: closedQuery
		}
	},

	getInitialState() {
		return ({
					viewConfig: {
						format: 'MMM',
						title: "[since] MMMM YYYY",
						startDate: moment().subtract( 2, 'months' ).startOf( 'month' ),
						endDate: moment().endOf( 'month' ),
					},
					expandall: false
				})
	},

	printChart(){
		var component = this;
		component.setState( {
			expandall: true
		} );
		
		setTimeout(function(){
			window.print();	
			component.setState( {
				expandall: false
			} );
		},200);
	},

	getMenu() {
		var component = this;
		return [ {
			label: ( "Day" ),
			run() {
				component.setState( {
					viewConfig: {
						format: 'hA',
						title: "dddd Do MMMM",
						startDate: moment().startOf( 'day' ),
						endDate: moment().endOf( 'day' ),
						groupBy: 'hour'
					}
				} );
			}
		}, {
			label: ( "Week" ),
			run() {
				component.setState( {
					viewConfig: {
						format: 'ddd',
						title: "for [week starting] Do MMMM",
						startDate: moment().startOf( 'week' ),
						endDate: moment().endOf( 'week' ),
						groupBy: 'day'
					}
				} );
			}
		}, {
			label: ( "Month" ),
			run() {
				component.setState( {
					viewConfig: {
						format: 'D',
						title: "MMMM YYYY",
						startDate: moment().startOf( 'month' ),
						endDate: moment().endOf( 'month' ),
						groupBy: 'day'
					}
				} );
			}
		}, {
			label: ( "3 Months" ),
			run() {
				component.setState( {
					viewConfig: {
						format: 'MMM',
						title: "[since] MMMM YYYY",
						startDate: moment().subtract( 2, 'months' ).startOf( 'month' ),
						endDate: moment().endOf( 'month' ),
					}
				} );
			}
		}, {
			label: ( "6 Months" ),
			run() {
				component.setState( {
					viewConfig: {
						format: 'MMM',
						title: "[since] MMMM YYYY",
						startDate: moment().subtract( 5, 'months' ).startOf( 'month' ),
						endDate: moment().endOf( 'month' ),
					}
				} );
			}
		}, {
			label: ( "Year" ),
			run() {
				component.setState( {
					viewConfig: {
						format: 'MMM',
						title: "YYYY",
						startDate: moment().startOf( 'year' ),
						endDate: moment().endOf( 'year' ),
						groupBy: 'month',
					}
				} );
			}
		} ];
	},

	getChartConfiguration() {
		return {
			lineData: {
				labels: this.data.labels || [ '' ],
				datasets: [ {
					label: "Closed",

					backgroundColor: "rgba(193,217,245,0.3)",
					borderColor: "rgba(193,217,245,1)",

					pointBackgroundColor: "rgba(193,217,245,1)",
					pointBorderColor: "#fff",

					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: "rgba(220,220,220,1)",

					data: this.data.closedSeries || [ 0 ]
				}, {
					label: "Open",

					backgroundColor: "rgba(117,170,238,0.3)",
					borderColor: "rgba(117,170,238,1)",

					pointBackgroundColor: "rgba(117,170,238,1)",
					pointBorderColor: "#fff",

					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: "rgba(220,220,220,1)",

					data: this.data.openSeries || [ 0 ]
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
		//for(var i=0;i<this.data.labels.length;i++) {
		this.chart.data.datasets[ 0 ].data = this.data.closedSeries;
		this.chart.data.datasets[ 1 ].data = this.data.openSeries;
		//}
		this.chart.data.labels = this.data.labels;
		this.chart.update();
	},

	componentDidMount() {
		this.resetChart();
	},

	componentDidUpdate() {
		//console.log(this.chart.data);
		//if(this.chart&&this.data.labels.length==this.chart.scale.xLabels.length) {
		this.updateChart();
		//}
		//else {
		//this.resetChart();
		//}
	},


	render() {
		var statusFilterQuery = ["Closed", "Deleted"];
		var openQuery = {
			status:{$nin:statusFilterQuery},
		}
		var closedQuery = {
			status: "Closed",
		}

		var team = Session.get( 'selectedTeam' );
		//var team = Teams.findOne({name:"Kaplan Australia Pty Ltd"});
		if ( team ) {
			openQuery[ "team._id" ] = team._id;
			closedQuery[ "team._id" ] = team._id;
		}

		var facility = Session.get( 'selectedFacility' );
		if ( facility ) {
			openQuery[ "facility._id" ] = facility._id;
			closedQuery[ "facility._id" ] = facility._id;
		}
		var buckets = {};
		var requestStatuses = ['Open','Closed'];
		var openRequests = Requests.find( openQuery );
		var closedRequests = Requests.find( closedQuery );

		openRequests.map(function(i){
			// console.log(i);
			if(!buckets['Open']){
				buckets[ 'Open' ] = [];
			}
			buckets[ 'Open' ].push( i );
			
		});
		
		closedRequests.map(function(i){
			if(!buckets['Closed']){
				buckets[ 'Closed' ] = [];
			}
			buckets[ 'Closed' ].push( i );
		});
		return (
			<div>
			<button className="btn btn-flat pull-left noprint" onClick={this.printChart}>
			<i className="fa fa-print" aria-hidden="true"></i>
			</button>
		        <Menu items={this.getMenu()}/>
		        <div className="ibox-title">
		        	<h2>Request activity {this.data.title} {facility?" for "+facility.name:" for all facilities"}</h2>
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
				<div className="gragh-table">
				<ServicesRequestsView requests={buckets} labels={ requestStatuses } expandall = {this.state.expandall}/>
				</div>
			</div>
		)
	}

} );

export default RequestActivityChart;