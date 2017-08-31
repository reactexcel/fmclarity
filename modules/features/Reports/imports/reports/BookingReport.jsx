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
const BookingReport = React.createClass( {

	mixins: [ ReactMeteorData ],

	getInitialState() {
		return {
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
			var query = {'status':'Booking'};
			team = user.getSelectedTeam();
			facility = this.state.facility;
			if ( facility ) {
				query[ "facility._id" ] = facility._id;
			}
			if ( this.state.startDate ) {
                query['bookingPeriod.startTime'] = {$gte: this.state.startDate}
			}
			if ( this.state.endDate ) {
                query['bookingPeriod.endTime'] = {$lte: this.state.endDate}
			}
			if ( team ) {
				data.requests = user.getRequests( query );
			}
		}
		return {
			team: team,
			facility: facility,
			reportData: data,
			showFacilityName: this.state.showFacilityName,
		}
	},

    componentDidMount(){
        $('.nav-list-selected').css('display','none')
				setTimeout(function(){
          $('.loader').addClass('hidden');
				}, 2000)
    },

    componentWillUnmount(){
        $('.nav-list-selected').css('display','block')
    },

	fields: {
        "Facility": "facility.name",
        "Resident name": "owner.name",
        "Area booked": ( item ) => {
            if ( item.level ) {
				return { val: item.level.name + ( item.area && item.area.name ? ( " ➡️️ " + item.area.name ) : "" ) + ( item.identifier && item.identifier.name ? ( " ➡️️ " + item.identifier.name ) : "") };
			}
		},
        "Booked from": (item)=>{
            let value = '';
            if(item.bookingPeriod && item.bookingPeriod.startTime){
                value = moment(item.bookingPeriod.startTime).format('MMMM Do YYYY, h:mm:ss a')
            }
            return {val:value}
        },
        "Booked to": (item)=>{
            let value = '';
            if(item.bookingPeriod && item.bookingPeriod.endTime){
                value = moment(item.bookingPeriod.endTime).format('MMMM Do YYYY, h:mm:ss a')
            }
            return {val:value}
        },
        "Duration": "duration",
        "Cost ($)": ( item ) => {
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
				//style: { textAlign: "right" }
			}
		}
	},
    setDataSet(newdata){
    	this.setState({
    		dataset:newdata,
    	});
    },

	render() {
		var data = this.data.reportData.requests;
		if ( !data ) {
			return <div/>
		}

		let { team, showFacilityName } = this.data, { facility } = this.state;
		let fields = showFacilityName ? this.fields : _.omit( this.fields, "Facility" );
		let styleForPDF = '<style type="text/css" media="print">.data-grid {display: flex; align-items: center; justify-content: center;} .data-grid-title-row{} .table {margin-right:20px; border-top: 2px solid black;border-bottom: 2px solid black;border-left: 2px solid black;border-right: 2px solid black;} #pre-head {border-right:2px solid black;border-bottom: 2px solid black;} #last-head {border-bottom: 2px solid black;} #pre-col {border-right:1px solid black; border-bottom:1px solid black} #last-col {border-bottom:1px solid black}</style>';
		//let pdfTitle = "Booking details of " + (this.state.facility && this.state.facility.name ? this.state.facility.name : "all facility") + ((this.state.startDate || this.state.endDate)?(' between ('+(this.state.startDate ? moment( this.state.startDate ).format('MMMM Do YYYY, h:mm:ss a'):'')+' - '+(this.state.endDate ? moment( this.state.endDate ).format('MMMM Do YYYY, h:mm:ss a'):'')+')'):'')
		let pdfTitle = "Bookings "+ ((this.state.startDate || this.state.endDate)?('between ('+(this.state.startDate ? moment( this.state.startDate ).format('MMMM Do YYYY, h:mm:ss a'):'')+' - '+(this.state.endDate ? moment( this.state.endDate ).format('MMMM Do YYYY, h:mm:ss a'):"")+') '):'') +"in " + (this.state.facility && this.state.facility.name ? this.state.facility.name : "all facility")
		let pdfName = (this.state.facility ? this.state.facility.name+'_' : 'All Facility_')+'Booking Report '+((this.state.startDate || this.state.endDate)?('_('+(this.state.startDate ? moment( this.state.startDate ).format('DD-MM-YY, h-mm-ss a'):'')+' to '+(this.state.endDate ? moment( this.state.endDate ).format('DD-MM-YY, h-mm-ss a'):'')+')'):'')
		let pdfDetails = {
 			styleForPDF:styleForPDF,
 			pdfTitle:pdfTitle,
			pdfName: pdfName.replace('.','')
 		}

		return (
			<div>
				<div style = { {padding:"5px 15px 20px 15px"} } className = "ibox search-box report-details">

					<h2>Booking Report</h2>
	                {this.state.dataset ? <div>
					<Menu items = { [ download(this.state.dataset, pdfDetails), print(this.state.dataset, this.refs.printable, pdfDetails) ] } />
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
										showFacilityName: (facility ? false : true)
									} ) } }
							/>

						</div>
						{/*<div className="col-md-3">

							<Select
								placeholder = "Service"
								value       = { this.state.service }
								items       = { this.state.facility ? this.state.facility.servicesRequired : null }
								onChange    = { ( service ) => { this.setState( { service } ) } }
							/>

						</div>*/}
					</div>
					<div className="row">
						<div className="col-md-4">

							<DateTime
								placeholder = "From"
								onChange    = { ( startDate ) => { this.setState( { startDate } ) } }
								value ={ this.state.startDate }
							/>

						</div>
						<div className="col-md-4">

							<DateTime
								placeholder = "To"
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

export default BookingReport;
