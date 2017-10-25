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
import { Requests,RequestActions,PPM_Schedulers } from '/modules/models/Requests';

import { ContactCard } from '/modules/mixins/Members';
import WoTable from '../reports/WoTable.jsx';
import moment from 'moment';

/**
 * @class 			RequestStatusReport
 * @memberOf 		module:features/Reports
 */
const WorkOrderReport = React.createClass( {

	mixins: [ ReactMeteorData ],

	getInitialState() {
		return {
			facility: this.props.facility,
			service: null,
			status: null,
			startDate: null,
			endDate: null,
			showFacilityName: true,
			dataset:null,
			supplier:null
		}
	},
  status : [ 'Open','Booking', 'New', 'Issued', 'Complete', 'Close', 'Cancelled' ],
	componentDidMount(){
		$('.nav-list-selected').css('display','none')
	},

	componentWillUnmount(){
		$('.nav-list-selected').css('display','block')
	},

	getMeteorData() {
		var user, team, facility, requests, status, data = {};
		user = Meteor.user();
		if ( user ) {
			var q = {};
			team = user.getSelectedTeam();
			facility = this.state.facility;
			service = this.state.service;
			supplier = this.state.supplier;
      		status = this.state.status;
			if ( facility ) {
				q[ "facility._id" ] = facility._id;
			}
			if ( status ) {
				let statusArray = []
				if(status == 'Open'){
					statusArray.push('New','Issued')
				} else {
					statusArray.push(status)
				}
				q.status = { $in: statusArray };
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
			let requests = Requests.findAll(q);
			data.requests = requests;
		}
		return {
			team: team,
			reportData: data
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
		// let fields = showFacilityName ? this.fields : _.omit( this.fields, "Facility" );
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

					<h2>Work Order Report</h2>
	                {this.state.dataset ? <div>
					<Menu items = { [ download(this.state.dataset,pdfDetails), print(this.state.dataset, this.refs.printable, pdfDetails) ] } />
				</div>:null}
					<div className="row">
						<div className="col-md-3">
							<Select
								placeholder = "Facility"
								value       = { facility }
								items       = { team ? team.getFacilities() : null }
								onChange    = { ( facility ) => {
									let stateToSet = {
										facility: facility,
										showFacilityName: false,
										service: null,
										supplier: null
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
            <div className="col-md-3">

							<Select
								placeholder = "Status"
								value       = { this.state.status }
								items       = { this.status }
								onChange    = { ( status ) => {
									this.setState( {
										status: status
									} )
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
          <WoTable WoReport data={data} reload={this.getWorkOrderData}/>
				</div>
			</div>
		)
	}
} )

export default WorkOrderReport;
