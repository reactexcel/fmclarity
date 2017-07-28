/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/modules/ui/MaterialNavigation';
import { DataTable } from '/modules/ui/DataTable';
import { download, print } from '/modules/ui/DataTable/source/DataSetActions.jsx';
import { DateTime, Select } from '/modules/ui/MaterialInputs';


import { ContactCard } from '/modules/mixins/Members';

import moment from 'moment';

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
		}
	},

	getMeteorData() {

		var user, team, facility, requests, data = {};
		user = Meteor.user();
		if ( user ) {
			var q = {};
			team = user.getSelectedTeam();
			facility = this.state.facility || user.getSelectedFacility();
			service = this.state.service;
			if ( facility ) {
				q[ "facility._id" ] = facility._id;
			}
			if ( service ) {
				q[ "service.name" ] = service.name;
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
		Issue: "name",
		Issued: "issuedAt",
		Due: "dueDate",
		//Supplier: "supplier.name",
		Supplier: ( item ) => {
			let supplier = item.getSupplier();
			if( supplier != null ){
				return {
					val: <ContactCard item={supplier} />
				}
			}
			return {
				val: <span/>
			}
		},
		Service: ( item ) => {
			if ( item.service ) {
				return { val: item.service.name + ( item.subservice && item.subservice.name ? ( " - " + item.subservice.name ) : "" ) };
			}
		},
		Location: ( item ) => {
			if ( item.level ) {
				return { val: item.level.name + ( item.area && item.area.name ? ( " - " + item.area.name ) : "" ) };
			}
		},
		Completed: "closeDetails.completionDate",
		Responsiveness: ( item ) => {
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
				val.val = duration.humanize();
				if ( val.originalVal < 0 ) {
					val.val = ( "- " + val.val );
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
		$(".loader").hide();
	},

	render() {
		var data = this.data.reportData.requests;
		if ( !data ) {
			return <div/>
		}

		let { team, showFacilityName } = this.data, { facility, service } = this.state;
		let fields = showFacilityName ? this.fields : _.omit( this.fields, "Facility" );

		return (
			<div>
				<div style = { {padding:"5px 15px 20px 15px"} } className = "ibox search-box report-details">

					<h2>Status Report</h2>
	                {this.state.dataset ? <div>
					<Menu items = { [ download(this.state.dataset), print(this.state.dataset, this.refs.printable) ] } />
				</div>:null}
					<div className="row">
						<div className="col-md-4">

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

						</div>
						<div className="col-md-3">
							{console.log(team,team.getFacilities() )}
							<Select
								placeholder = "Facility"
								value       = { facility }
								items       = { team ? team.getFacilities() : null }
								onChange    = { ( facility ) => {
									this.setState( {
										facility: facility,
										showFacilityName: false
									} ) } }
							/>

						</div>
						<div className="col-md-3">

							<Select
								placeholder = "Service"
								value       = { this.state.service }
								items       = { this.state.facility ? this.state.facility.servicesRequired : null }
								onChange    = { ( service ) => { this.setState( { service } ) } }
							/>

						</div>
					</div>
					<div className="row">
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
