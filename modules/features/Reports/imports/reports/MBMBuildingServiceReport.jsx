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
const MBMBuildingServiceReport = React.createClass( {

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
			status:{$ne:'Deleted'}
		}

		var facility = Session.get( 'selectedFacility' );
		if ( facility ) {
			query[ "facility._id" ] = facility._id;
		}

		var team = Session.get( 'selectedTeam' );
		if ( team ) {
			query[ "team._id" ] = team._id;
		}
		const handle = Meteor.subscribe('User: Facilities, Requests');

		var labels = [];
		var set = [];
        var queries = [];

        for (var i = 0; i < 12; i++) {
            query["createdAt"] = {
				$gte: moment().subtract(i, "months").startOf("month").toDate(),
				$lte: moment().subtract(i, "months").endOf("month").toDate( )
			};
            queries.push( Object.assign({},query) );
            let requestCursor = Requests.find( query )
            set.unshift( requestCursor.count() );
            labels.unshift( moment().subtract(i, "months").startOf("month").format("MMM-YY") );
        }
        let d;
        if ( facility ) {
            let services = facility.servicesRequired;
            d = services.map( function( s, idx ){
                let dataset = queries.map( function(q){
                    q["service.name"] = s.name;
                    return Requests.find( q ).count();
                });
                return <SingleServiceRequest serviceName={s.name} set={dataset} labels={labels} key={idx} id={idx}/>
            });
            console.log(d);
        }

		return {
			facility: facility,
			labels: labels,
			set: set,
            d:d,
			ready: handle.ready()
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

	getChartConfiguration() {
		return {
			barData: {
				labels: this.data.labels || [ '' ],
				datasets: [ {
                    label: "Pure calls",
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
						},
						ticks: {
							autoSkip: false,
						}
					} ],
					yAxes: [ {
						ticks: {
							beginAtZero: true
						},
					} ]
				},
				legend: {
					display: false
				}
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
		this.chart.data.datasets[ 0 ].data = this.data.set;
		this.chart.data.labels = this.data.labels;
		this.chart.update();
	},

	componentDidMount() {
		this.resetChart();
	},

	componentDidUpdate() {
		this.updateChart();
	},

	render() {
		var facility=this.data.facility;
		facilities=null;
		if (this.data.ready) {
			facilities = Meteor.user().getTeam().getFacilities();
		}
		return (
			<div>
			<button className="btn btn-flat pull-left noprint"  onClick={this.printChart}>
			    <i className="fa fa-print" aria-hidden="true"></i>
			</button>
				<div className="ibox-title">
					<h2>Building Service Requests {facility&&facility.name?" for "+facility.name: (facilities && facilities.length=='1') ? "for "+ facilities[0].name : " for all facilities"}</h2>
				</div>
				<div className="ibox-content">
					<div>
						<canvas id="bar-chart"></canvas>
					</div>
				</div>
                {this.data.d?this.data.d:null}
			</div>
		)
	}

} );







const SingleServiceRequest = React.createClass( {

	getInitialState() {
		return ( {
			expandall: false
		} )
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

	getChartConfiguration() {
		return {
			barData: {
				labels: this.props.labels || [ '' ],
				datasets: [ {
                    label: "Pure calls",
					backgroundColor: "rgba(117,170,238,0.8)",
					borderColor: "rgba(117,170,238,1)",
					hoverBackgroundColor: "rgba(117,170,238,0.5)",
					hoverBorderColor: "rgba(117,170,238,1)",
					data: this.props.set || [ 0 ]
				} ]
			},
			barOptions: {
				scales: {
					xAxes: [ {
						gridLines: {
						},
						ticks: {
							autoSkip: false,
						}
					} ],
					yAxes: [ {
						ticks: {
							beginAtZero: true
						},
					} ]
				},
				legend: {
					display: false
				}
			}
		}

	},

	resetChart() {
		var config = this.getChartConfiguration();
		if ( this.chart ) {
			this.chart.destroy();
		}
		var ctx = document.getElementById( "bar-chart-" + this.props.id ).getContext( "2d" );
		this.chart = new Chart( ctx, {
			type: 'bar',
			data: config.barData,
			options: config.barOptions
		} );
	},

	updateChart() {
		this.chart.data.datasets[ 0 ].data = this.props.set;
		this.chart.data.labels = this.props.labels;
		this.chart.update();
	},

	componentDidMount() {
		this.resetChart();
	},

	componentDidUpdate() {
		this.updateChart();
	},

	render() {
		return (
			<div>
			<button className="btn btn-flat pull-left noprint"  onClick={this.printChart}>
			    <i className="fa fa-print" aria-hidden="true"></i>
			</button>
				<div className="ibox-title">
					<h2>Requests for {this.props.serviceName}</h2>
				</div>
				<div className="ibox-content">
					<div>
						<canvas id={"bar-chart-" + this.props.id}></canvas>
					</div>
				</div>
			</div>
		)
	}

} );

export default MBMBuildingServiceReport;
