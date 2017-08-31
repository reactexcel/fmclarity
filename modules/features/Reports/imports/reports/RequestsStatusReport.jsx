/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/modules/ui/MaterialNavigation';
import { DataTable } from '/modules/ui/DataTable';
import { download, print } from '/modules/ui/DataTable/source/DataSetActions.jsx';
import { DateTime, Select, Text } from '/modules/ui/MaterialInputs';


import { ContactCard } from '/modules/mixins/Members';

import moment from 'moment';
import { loaderStoreActions } from '/modules/ui/Loader/imports/store/LoaderStore';
/**
 * @class 			RequestStatusReport
 * @memberOf 		module:features/Reports
 */
const RequestsStatusReport = React.createClass( {

	mixins: [ ReactMeteorData ],

	getInitialState() {
		return {
			service: null,
			startDate: null,
			endDate: null,
			showFacilityName: true,
			dataset:null,
			supplier:null
		}
	},

	componentDidMount(){
		$('.nav-list-selected').css('display','none')
	},

	componentWillUnmount(){
		$('.nav-list-selected').css('display','block')
	},

	getMeteorData() {

		var user, team, facility, requests, data = {};
		user = Meteor.user();
		if ( user ) {
			var q = {};
			team = user.getSelectedTeam();
			facility = this.state.facility;
			service = this.state.service;
			supplier = this.state.supplier;
			if ( facility ) {
				q[ "facility._id" ] = facility._id;
			}
			if ( service ) {
				q[ "service.name" ] = service.name;
			}
			if( supplier ){
				q[ "supplier.name" ] = supplier
			}
			if ( this.state.startDate || this.state.endDate ) {
				q.issuedAt = {};
			}
			if ( this.state.startDate ) {
				q.issuedAt.$gte = this.state.startDate;
			}
			if ( this.state.endDate ) {
				q.issuedAt.$lte = this.state.endDate;
			}
			if ( team ) {
				data.requests = user.getRequests( q );
			}
		}
		return {
			team: team,
			facility: facility,
			reportData: data,
			showFacilityName: this.state.showFacilityName,
		}
	},

	fields: {
		//Priority: "priority",
		// Priority: ( item ) => {
		// 	let color = "#4d4d4d";
		// 	if ( item.priority == "Critical") {
		// 		color = "#ff1a1a";
		// 	} else if ( item.priority == "Urgent" ) {
		// 		color = "#ff471a";
		// 	} else if ( item.priority == "Scheduled" ) {
		// 		color = "#3399ff";
		// 	} else if ( item.priority == "Standard" ) {
		// 		color = "#00ccff";
		// 	} else if ( item.priority == "Closed" ) {
		// 		color = "#33cc33";
		// 	}
		// 	return {
		// 		val: <span>	<i style = {{width:"15px", color: color, fontSize: "11px"}} className = {"fa fa-arrow-up"}></i>{item.priority}</span>,
		// 	}
		// },
		Status:  ( item ) => {
			let color = "#4d4d4d";
			if ( item.status == "Closed") {
				color = "#ff1a1a";
			} else if ( item.status == "New" ) {
				color = "#33cc33";
			} else if ( item.status == "Issued" ) {
				color = "#00ccff";
			}
			return {
				val: <span>	<i style = {{width:"15px", color: color, fontSize: "11px"}} className = {"fa fa-circle "}></i>{item.status}</span>,
				style: {
					//color: color
				}
			}
		},
		Facility: "facility.name",
		"PO#": "code",
		//Issue: "name",
		Issued: "issuedAt",
		Due: "dueDate",
		Summary: "name",
		Supplier: "supplier.name",
		/*Supplier: ( item ) => {
			let supplier = item.getSupplier();
			if( supplier != null ){
				return {
					val: <div style={{minWidth:'100px'}}><ContactCard item={supplier} removeEmail={true}/></div>
				}
			}
			return {
				val: <span/>
			}
		},*/
		Service: ( item ) => {
			if ( item.service && item.service.name ) {
				return { val: item.service.name + ( item.subservice && item.subservice.name ? ( " - " + item.subservice.name ) : "" ) };
			}else{
				return { value: ''}
			}
		},
		Location: ( item ) => {
			if ( item.level ) {
				return { val: item.level.name + ( item.area && item.area.name ? ( " - " + item.area.name ) : "" ) };
			}
		},
		Due: "dueDate",
		'Compl.': "closeDetails.completionDate",
		"Response (days)": ( item ) => {
			if ( !item.closeDetails || item.closeDetails.completionDate == null || item.closeDetails.completionDate == "" ) {
				return;
			}

			let start = moment( item.dueDate ),
				end = moment( item.closeDetails.completionDate ),
				duration = moment.duration( start.diff( end ) );

			if ( duration ) {
				let val = {};
				val.duration = duration;
				val.originalVal = parseInt( duration.asMinutes() );
				//val.val = duration.humanize();
				val.val = duration._data && duration._data.days ? duration._data.days.toString() : (1).toString();
				if ( val.originalVal < 0 ) {
					//val.val = ( "- " + val.val );
					val.style = { color: "red" };
				}
				return val;
			}
		},
		"Amount ($)": ( item ) => {
			let val = item.costThreshold || 0;
			if ( val ) {
				val = parseFloat( val );
				if ( isNaN( val ) ) {
					val = 0;
				}
			}
			return {
				originalVal: val,
				val: val.toFixed( 2 ),
				style: { textAlign: "right" }
			}
		}
	},
    setDataSet(newdata){
    	this.setState({
    		dataset:newdata,
    	});
    },
	componentDidUpdate(){
    loaderStoreActions.setLoaderVisibility(false);
	},

	render() {
		var data = this.data.reportData.requests;
		if ( !data ) {
			return <div/>
		}

		let { team, showFacilityName } = this.data, { facility, service } = this.state;
		let fields = showFacilityName ? this.fields : _.omit( this.fields, "Facility" );
		let styleForPDF = '<style type="text/css" media="print">@page { size: landscape; } .table {border-top: 2px solid black;border-bottom: 2px solid black;border-left: 2px solid black;border-right: 2px solid black;} #pre-head {border-right:2px solid black;text-align:center;border-bottom: 2px solid black; padding-left: 0px; padding-right: 10px;} #last-head {text-align:center;border-bottom: 2px solid black; padding-left: 0px; padding-right: 10px;} #pre-col {text-align:left; border-right:1px solid black; border-bottom:1px solid black; padding-left: 0px;  padding-right: 10px;} .Summary{min-width:320px;} .Supplier{min-width:120px;} .Service{min-w-width:120px;} #last-col {text-align:left; border-bottom:1px solid black;  padding-left: 0px;  padding-right: 10px;}</style>';
		//let pdfTitle = (this.state.facility ? this.state.facility.name+' ' : '')+'Status Report '+(this.state.startDate || this.state.endDate ?'for ('+(this.state.startDate? moment( this.state.startDate ).format('DD/MM/YY'):'')+' -'(this.state.endDate? moment( this.state.endDate ).format('DD/MM/YY'):'')+' )':'')
		let pdfTitle = (this.state.facility ? this.state.facility.name+' ' : 'All Facility ')+'Status Report '+((this.state.startDate || this.state.endDate)?('for ('+(this.state.startDate ? moment( this.state.startDate ).format('DD/MM/YY'):'')+' - '+(this.state.endDate ? moment( this.state.endDate ).format('DD/MM/YY'):'')+')'):'')
		let pdfName = (this.state.facility ? this.state.facility.name+'_' : 'All Facility_')+'Status Report '+((this.state.startDate || this.state.endDate)?('_('+(this.state.startDate ? moment( this.state.startDate ).format('DD-MM-YY'):'')+' to '+(this.state.endDate ? moment( this.state.endDate ).format('DD-MM-YY'):'')+')'):'')
		let pdfDetails = {
			styleForPDF:styleForPDF,
			pdfTitle:pdfTitle,
			pdfName: pdfName.replace('.','')
		}
		return (
			<div>
				<div style = { {padding:"5px 15px 20px 15px"} } className = "ibox search-box report-details">

					<h2>Status Report</h2>
	                {this.state.dataset ? <div>
					<Menu items = { [ download(this.state.dataset,pdfDetails), print(this.state.dataset, this.refs.printable, pdfDetails) ] } />
				</div>:null}
					<div className="row">
						{/*<div className="col-md-4">

							<Select
								placeholder = "Team"
								value       = { team }
								items       = { Meteor.user().getTeams() }
								onChange    = { ( team ) => {
									Session.selectTeam( team )
									this.setState( {
										facility: null,
										service: null,
										showFacilityName: true
									} )
								} }
							/>

						</div>*/}
						<div className="col-md-3">
							<Select
								placeholder = "Facility"
								value       = { facility }
								items       = { team ? team.getFacilities() : null }
								onChange    = { ( facility ) => {
									let stateToSet = {
										facility: facility,
										showFacilityName: false
									}
									if(_.isEmpty(facility)){
										stateToSet.showFacilityName = (facility && facility.name ? false : true);
										stateToSet.service = null;
									}
									this.setState(stateToSet)
								} }
							/>

						</div>
						<div className="col-md-3">

							<Select
								placeholder = "Service"
								value       = { this.state.service }
								items       = { this.state.facility ? this.state.facility.servicesRequired : null }
								onChange    = { ( service ) => {
									this.setState( { service } )
								} }
							/>

						</div>
					</div>
					<div className="row">
						<div className="col-md-4">
							<Text
								placeholder="Supplier"
								value={this.state.supplier?this.state.supplier.$regex:''}
								onChange={ ( value ) => {
									let supplierName = value?{
										$regex: value,
										$options: 'i'
									}:null
									this.setState({ supplier: supplierName})
								} }
							/>
						</div>
						<div className="col-md-4">

							<DateTime
								placeholder = "Start Date"
								onChange    = { ( startDate ) => { this.setState( { startDate } ) } }
								value ={ this.state.startDate }
							/>

						</div>
						<div className="col-md-4">

							<DateTime
								placeholder = "End Date"
								onChange    = { ( endDate ) => { this.setState( { endDate } ) } }
								value ={ this.state.endDate }
							/>

						</div>
					</div>

				</div>
				<div className = "ibox" ref="printable">
					<DataTable items={data} fields={fields} includeActionMenu={true} setDataSet={this.setDataSet}/>
				</div>
			</div>
		)
	}
} )

export default RequestsStatusReport;
