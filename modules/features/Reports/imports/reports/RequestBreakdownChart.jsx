/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

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

	mixins: [ ReactMeteorData ],

	getInitialState() {
		var startDate = moment().subtract( 2, 'months' ).startOf( 'month' );
		var title = startDate.format( "[since] MMMM YYYY" )
		return ( {
			startDate: startDate,
			title: title,
			expandall: false
		} )
	},

	getMeteorData() {

		var startDate = this.state.startDate;
		var query = {
			createdAt: {
				$gte: this.state.startDate.toDate()
			},
			status:{$ne:'Deleted'}
		}

		var facility = Session.get( 'selectedFacility' );
		if ( facility ) {
			query[ "facility._id" ] = facility._id;
		}

		var team = Session.get( 'selectedTeam' );
		//var team = Teams.findOne({name:"Kaplan Australia Pty Ltd"});
		if ( team ) {
			query[ "team._id" ] = team._id;
		}

		var requests = Requests.find( query );

		var buckets = {};
		var costs = {};
		var labels = [];
		var counts = [];
		var set = [];
		requests.map( function( i ) {
			var serviceName;
			if ( i.service && i.service.name ) {
				serviceName = i.service.name;
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
				buckets[ serviceName ].push( i );
				var newCost = parseInt( i.costThreshold );
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
			facility: facility,
			labels: labels,
			set: set, //costs//counts
			buckets: buckets
		}
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
		//console.log(this.data);
		return {
			barData: {
				labels: this.data.labels || [ '' ],
				datasets: [ {
					backgroundColor: "rgba(117,170,238,0.8)",
					borderColor: "rgba(117,170,238,1)",
					hoverBackgroundColor: "rgba(117,170,238,0.5)",
					hoverBorderColor: "rgba(117,170,238,1)",
					data: this.data.set || [ 0 ]
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
		//console.log(this.data.set);
		//console.log(this.chart.data);
		//for(var i=0;i<this.data.set.length;i++) {
		this.chart.data.datasets[ 0 ].data = this.data.set;
		//}
		this.chart.data.labels = this.data.labels;
		//this.chart.scale.xLabels = this.data.labels;
		this.chart.update();
		//this.chart.reDraw();
	},

	componentDidMount() {
		this.resetChart();
	},

	componentDidUpdate() {
		// ???
		//if(this.chart&&this.data.labels.length==this.chart.scale.xLabels.length) {
		this.updateChart();
		//}
		//else {
		//this.resetChart();
		//}
	},

	render() {
		var facility=this.data.facility;
		return (
			<div>
			<button className="btn btn-flat pull-left noprint"  onClick={this.printChart}>
			<i className="fa fa-print" aria-hidden="true"></i>
			</button>
				<Menu items={this.getMenu()}/>
				<div className="ibox-title">
					<h2>Request breakdown {this.state.title} {facility?" for "+facility.name:" for all facilities"}</h2>
				</div>
				<div className="ibox-content">
					<div>
						<canvas id="bar-chart"></canvas>
					</div>
				</div>
				<div>
				<ServicesRequestsView requests={this.data.buckets} labels={ this.data.labels } expandall={this.state.expandall}/>
				</div>
			</div>
		)
	}

} );

export default RequestBreakdownChart;
