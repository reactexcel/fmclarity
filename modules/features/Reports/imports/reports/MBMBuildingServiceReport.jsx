import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/modules/ui/MaterialNavigation';
import { Requests } from '/modules/models/Requests';
import { ServicesRequestsView } from '/modules/mixins/Services';

import moment from 'moment';
import { TextArea } from '/modules/ui/MaterialInputs';
import { DataTable } from '/modules/ui/DataTable';
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
            queries.unshift( Object.assign({},query) );
            let requestCursor = Requests.find( query )
            set.unshift( requestCursor.count() );
            labels.unshift( moment().subtract(i, "months").startOf("month").format("MMM-YY") );
        }
        let d;
        if ( facility ) {
            let services = facility.servicesRequired;
						console.log(facility);
            d = services.map( function( s, idx ){
							if(s != null){

								let dataset = queries.map( function(q){
									q["service.name"] = s.name;
									return Requests.find( q ).count();
								});
								return <SingleServiceRequest serviceName={s.name} set={dataset} labels={labels} key={idx} id={idx}/>
							}
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
	componentWillMount(){
		$("#fab").hide();
	},
	componentWillUnmount(){
		$("#fab").show();
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
					<div style={{width:"830px","height":"450px",paddingLeft:"20%",paddingTop:"8%"}}>
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
			expandall: false,
			comment: ""
		} )
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

	setDataSet(newdata){
		this.setState({
			dataset:newdata,
		});
	},
	fields:{
		"Event Name": "name",
		"Completed At": ( item ) => {
			if( item && item.closeDetails && item.closeDetails.completionDate ){
				return {
					val: moment( item.closeDetails.completionDate ).format("DD-MMM-YY")
				}
			}
		}
	},
	getData(){
		let facility = Session.getSelectedFacility();
		let data = Requests.findAll( {
			'facility._id': facility._id,
			"service.name": this.props.serviceName,
			status: "Complete",
			type: "Ad-Hoc",
			priority: "PMP",
			"closeDetails.completionDate":{
				$gte: new moment().startOf("month").toDate(),
				$lte: new moment().endOf("month").toDate()
			}
		} );
		// console.log(data,  this.props.serviceName);
		return data;
	},

	render() {
		let data = this.getData();
		return (
			<div style={ { marginTop: "100px", marginBottom: "10px", borderTop:"2px solid"  } }>
				<div className="ibox-title">
					<h2>Requests for {this.props.serviceName}</h2>
				</div>
				<div className="ibox-content">
					<div style={{width:"830px","height":"400px",paddingLeft:"20%",paddingTop:"5%"}}>
						<canvas id={"bar-chart-" + this.props.id} style={{width:"630px","height":"300px"}}></canvas>
					</div>
				</div>
				<div className="data-table">
					<div style={{width:"70%", marginLeft: "15%", marginTop:'20px', marginBottom:"20px", border:"1px solid"}}>
						<DataTable items={data.length ? data : [{name:""}]} fields={this.fields} includeActionMenu={true} setDataSet={this.setDataSet}/>
					</div>
				</div>
				<div style={ { marginTop: "20px", marginBottom: "-15px",height:"100px" } }>
					<div className="comment-header">
						<h4>Comments</h4>
						<span style={{float: "right"}}>
							<button className="btn btn-flat" onClick={() => {
									let edited = this.state.showEditor;
									let component = this;
									this.setState({
										showEditor: !this.state.showEditor
									}, () => {
										if ( !edited ){
											console.log("edited", component );
											$(component.refs.textarea.refs.input).focus();
										}
									})
								}}>
								{!this.state.showEditor?
									<i className="fa fa-pencil-square-o" aria-hidden="true"></i>:
									<i className="fa fa-floppy-o" aria-hidden="true"></i>
								}
							</button>
						</span>
					</div>
					<div className="comment-body">
						{this.state.showEditor?
							<TextArea
								ref="textarea"
								style={{height:"50px"}}
								value={this.state.comment}
								onChange={( value ) => {this.setState({ comment: value })}}
								/>:
							<div>
								<p style={{fontFamily: "inherit"}}>{this.state.comment}</p>
							</div>}
					</div>
				</div>
			</div>
		)
	}

} );

export default MBMBuildingServiceReport;
