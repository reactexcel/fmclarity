/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/modules/ui/MaterialNavigation';
import { DataTable } from '/modules/ui/DataTable';
import { DateTime, Select } from '/modules/ui/MaterialInputs';


/**
 * @class 			RequestStatusReport
 * @memberOf 		module:features/Reports
 */
const RequestsStatusReport = React.createClass( {

	mixins: [ ReactMeteorData ],

	fields: {
		Priority: "priority",
		Status: "status",
		Facility: "facility.name",
		"PO#": "code",
		Issue: "name",
		Issued: "issuedAt",
		Due: "dueDate",
		Supplier: "supplier.name",
		Service: ( item ) => {
			if ( item.service ) {
				return { val: item.service.name + ( item.subservice ? ( " - " + item.subservice.name ) : "" ) };
			}
		},
		Location: ( item ) => {
			if ( item.level ) {
				return { val: item.level.name + ( item.area ? ( " - " + item.area.name ) : "" ) };
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

	getInitialState() {
		return {
			service: null,
			startDate: null,
			endDate: null
		}
	},

	getMeteorData() {

		Meteor.subscribe( 'Users' );
		Meteor.subscribe( 'Teams' );
		Meteor.subscribe( 'Facilities' );
		Meteor.subscribe( 'Requests' );

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
			reportData: data
		}
	},

	render() {
		var data = this.data.reportData.requests;

		if ( !data ) {
			return <div/>
		}

		let { team } = this.data, { facility, service } = this.state;

		return (
			<div>
				<div style = { {padding:"15px"} } className = "report-details">

					<h2>Status Report</h2>

					<div className="row">
						<div className="col-md-4">

							<Select
								placeholder = "Team"
								value       = { team }
								items       = { Meteor.user().getTeams() }
								onChange    = { ( team ) => { Session.selectTeam( team ) } }
							/>

						</div>
						<div className="col-md-4">

							<Select
								placeholder = "Facility"
								value       = { facility }
								items       = { team ? team.facilities : null }
								onChange    = { ( facility ) => {
									this.setState( { facility } ) } }
							/>

						</div>
						<div className="col-md-4">

							<Select
								placeholder = "Service"
								value       = { this.state.service }
								items       = { this.state.facility ? this.state.facility.services : null }
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
				<DataTable items={data} fields={this.fields}/>
			</div>
		)
	}
} )

export default RequestsStatusReport;
