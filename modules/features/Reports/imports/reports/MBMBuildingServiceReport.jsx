import React from "react";
import PubSub from 'pubsub-js';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/modules/ui/MaterialNavigation';
import { Requests,PPM_Schedulers } from '/modules/models/Requests';
import { Reports } from '/modules/models/Reports';
import { ServicesRequestsView } from '/modules/mixins/Services';
import { Facilities } from '/modules/models/Facilities';
import DocViewEdit from '../../../.././models/Documents/imports/components/DocViewEdit.jsx';

import moment from 'moment';
import { TextArea } from '/modules/ui/MaterialInputs';
import { DataTable } from '/modules/ui/DataTable';
import WoTable from '../reports/WoTable.jsx';

import { hideLoader } from '/modules/ui/Loader/imports/components/Loader'

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
		let	user = Meteor.user();
		let team = user.getSelectedTeam();
		let facility = Session.getSelectedFacility();
		var startDate = moment().subtract( 2, 'months' ).startOf( 'month' );
		var title = startDate.format( "[since] MMMM YYYY" )
		return ( {
			startDate: startDate,
			title: title,
			expandall: false,
			team,
			facility,
			commentString :""
		} )
	},

	getMeteorData() {

		var startDate = this.state.startDate;
		var query = {
			status:{$nin:['Deleted','PPM']}
		}
		var facility = Session.getSelectedFacility();;
		if ( facility ) {
			query[ "facility._id" ] = facility._id;
		}

		var team = Session.get( 'selectedTeam' );
		if ( team ) {
			query[ "team._id" ] = team._id;
		}
		const handle = Meteor.subscribe('User: Facilities, Requests , PPM_Schedulers');
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

            set.unshift( requestCursor.count() + PPM_Schedulers.find( query ).count() );
            labels.unshift( moment().subtract(i, "months").startOf("month").format("MMM-YY") );
        }
				let commentQuery = {}
				commentQuery[ "facility._id" ] = facility._id;
				commentQuery[ "team._id" ] = team._id;
				commentQuery["type"]={$nin:['WOComment','Defect']};
				commentQuery["createdAt"] = {
					$gte: moment().subtract(0, "months").startOf("month").toDate(),
					$lte: moment().subtract(0, "months").endOf("month").toDate( )
				};
				let currentMonthComment = Reports.find(commentQuery).fetch();
				commentQuery["createdAt"] = {
					$gte: moment().subtract(1, "months").startOf("month").toDate(),
					$lte: moment().subtract(1, "months").endOf("month").toDate( )
				};
				let previousMonthComment = Reports.find(commentQuery).fetch();

        let d;
        if ( facility ) {
            let services = facility.servicesRequired;
						// console.log(services);
						services = services.filter((val) => val != null && val.name != "" || null || undefined)
            d = services.map( function( s, idx ){
							let finalComment
							let currentMonth = false
							if(s != null){
								let previousMonthServiceComment = previousMonthComment.filter((val) => val.service === s.name);
								let presentMonthServiceComment = currentMonthComment.filter((val) => val.service === s.name);
								if(presentMonthServiceComment.length > 0){
									currentMonth = true
									finalComment = presentMonthServiceComment
								}else{
									currentMonth = false
									finalComment = previousMonthServiceComment
								}

								let dataset = queries.map( function(q){
									q["service.name"] = s.name;

									return Requests.find( q ).count() + PPM_Schedulers.find( q ).count();
								});

								let showChart = false ;
								dataset.map((val)=>{
									if(val > 0){
										showChart = true
									}
								})
								return  showChart ? <SingleServiceRequest serviceName={s.name} commentData = {finalComment} currentMonth ={currentMonth} set={dataset} labels={labels} key={idx} id={idx}/>:null
							}
            });
            //console.log(d);
        }

		return {
			facility: facility,
			labels: labels,
			set: set,
            d:d,
			ready: handle.ready()
		}
	},
	componentWillUnmount(){
		$("#fab").show();
		PubSub.publish('stop', "test");
	},
	componentWillMount(){
		$("#fab").hide();
		if(!this.props.MonthlyReport){
			let query = {};
			query[ "facility._id" ] = this.state.facility ? this.state.facility._id : null;
			query[ "team._id" ] = this.state.team ? this.state.team._id : null;
			query["createdAt"] = {
				$gte: moment().subtract(1, "months").startOf("month").toDate(),
				$lte: moment().subtract(0, "months").endOf("month").toDate( )
			};
			let comments = Reports.find(query).fetch();

			comments = comments.filter((c) => c.hasOwnProperty("service"));
			let commentString = " "
			comments.map((c)=>{
				commentString = commentString + c.comment
			})
			this.setState({commentString})
		}
	},

	componentDidMount(){
		if(!this.props.MonthlyReport){
			let update = setInterval(()=>{

				PubSub.subscribe( 'stop', (msg,data) => {
					clearInterval(update)
				});
				let query = {};
				query[ "facility._id" ] = this.state.facility._id;
				query[ "team._id" ] = this.state.team._id;
				query["createdAt"] = {
					$gte: moment().subtract(1, "months").startOf("month").toDate(),
					$lte: moment().subtract(0, "months").endOf("month").toDate( )
				};
				let comments = Reports.find(query).fetch();

				comments = comments.filter((c) => c.hasOwnProperty("service"));
				let UpdatedString = " "
				comments.map((c)=>{
					UpdatedString = UpdatedString + c.comment
				})
				if(UpdatedString != this.state.commentString){
					this.setState({
						commentString : UpdatedString
					})
				}
			},1000)
		}
	},

	printChart(){
		$(".body-background").css({"position":"relative"});
		$(".page-wrapper-inner").css({"display":"block"});
		var component = this;
		component.setState( {
			expandall: true
		} );

		setTimeout(function(){
			window.print();
			component.setState( {
				expandall: false
			} );
			$(".body-background").css({"position":"fixed"});
			$(".page-wrapper-inner").css({"display":"inlineBlock"});
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
				{this.props.MonthlyReport ? null :
					<button className="btn btn-flat pull-left noprint"  onClick={this.printChart}>
						<i className="fa fa-print" aria-hidden="true"></i>
					</button>
				}
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
			comment: this.props.commentData.length > 0 ? this.props.commentData[0].comment : "",
			commentData:this.props.commentData.length > 0 ? this.props.commentData[0] : {},
			currentMonth: this.props.currentMonth
		} )
	},
	componentWillReceiveProps(props){
	this.setState({
		comment: props.commentData.length > 0 ? props.commentData[0].comment : "",
		commentData:props.commentData.length > 0 ? props.commentData[0] : {},
		currentMonth:props.currentMonth
	})
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

	componentWillMount(){
		this.getWorkOrderData();
	},

	componentDidMount() {
		this.resetChart();
		setTimeout(function(){
      hideLoader();
		},2000)
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

		return data;
	},

	getWorkOrderData() {
		var user = Meteor.user();
		if ( user ) {
			let facility = Session.getSelectedFacility();
			if ( facility ) {
				var q = {};
				q['facility._id'] = facility._id;
				 q['issuedAt'] = {
						 $gte: moment().startOf("month").toDate(),
						 $lte: moment().endOf("month").toDate()
				 };
					q["type"] = {$ne:'Defect'}
					q['status'] ={$nin:['Deleted','PPM','New']};
					q['service.name'] = this.props.serviceName;
					let requests = Requests.findAll(q);
					let PPMIssued = PPM_Schedulers.findAll(q);
					if(PPMIssued.length > 0){
						PPMIssued.map((val)=>{
							requests.push(val)
						})
					}
					this.setState({WoData: requests.length ? requests : [] });
			}
		}
	},

	handleComment(item){
		let	user = Meteor.user();
		let team = user.getSelectedTeam();
		let facility = Session.getSelectedFacility();
		let commentSchema = {
			service : this.props.serviceName,
			team : {
				_id : team._id
			},
			facility :{
				_id : facility._id
			},
			comment : this.state.comment.trim()
		}
		if(item){

			if(!item._id){
				let test = this.state.comment.trim()

				if(test != "" || null || undefined){
					Reports.save.call(commentSchema);
				}

			}else{
				item["comment"] = this.state.comment;
				let test = this.state.comment.trim()

				if(test != "" || null || undefined){
					if(this.state.currentMonth){
						console.log("current");
						Reports.save.call(item);
				}else{
						console.log("previousMonthComment");
						Reports.save.call(commentSchema);
					}
				}

			}
		}
	},

	render() {
		let data = this.getData();
		let item = this.state.commentData;
		return (
			<div style={ { marginTop: "100px", marginBottom: "10px", borderTop:"2px solid"  } }>
				<div className="ibox-title">
					<h2> {this.props.serviceName}</h2>
				</div>
				<div className="ibox-content">
					<div style={{width:"830px","height":"400px",paddingLeft:"20%",paddingTop:"5%"}}>
						<canvas id={"bar-chart-" + this.props.id} style={{width:"630px","height":"300px"}}></canvas>
					</div>
				</div>
				<div style={ { marginTop: "20px", marginBottom: "70px" } }>
					<div className="comment-header">
						<h4>Comments</h4>
						<span style={{float: "right"}}>
							<button className="btn btn-flat" onClick={(e) => {
									let edited = this.state.showEditor;
									let component = this;
									this.setState({
										showEditor: !this.state.showEditor
									}, () => {
										if ( !edited ){
											//console.log("edited", component );
											$(component.refs.textarea.refs.input).focus();
										}else{
											this.handleComment(item);
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
				<div className="data-table">
					<div style={{marginTop:'20px', marginBottom:"20px", border:"1px solid"}}>
						<WoTable data={this.state.WoData} reload={this.getWorkOrderData}/>
					</div>
				</div>
			</div>
		)
	}

} );

export default MBMBuildingServiceReport;
