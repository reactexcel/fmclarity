/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";
import ComplianceViewDetail from './ComplianceViewDetail.jsx';
import { FacilityFilter } from '/modules/models/Facilities';
import DefaultComplianceRule from './../../data/DefaultComplianceRule.js'

/**
 * @class 			CompliancePageIndex
 * @memberOf		module:features/Compliance
 */
function CompliancePageIndex( props ) {
	let { team, services, facility, facilities } = props;

	if( !team ) {
		return <div/>
	}
	function loadDefaultRules() {
		let facility = Session.getSelectedFacility();
		let servicesRequired = facility && facility.servicesRequired;
		if( facility ) {
			Meteor.call("Facilities.setupCompliance", facility, DefaultComplianceRule )
		} else {
			window.alert("Please select a facility to load the default rules.");
		}

	}
	return (
		<div className = "facility-page animated fadeIn">
			<FacilityFilter items = { facilities } selectedItem = { facility } />
			<div className="row">
				<div className="col-sm-12">
					<div className="pull-right">
						<button className="btn btn-primary btn-flat" onClick={loadDefaultRules}>
							{`load default rules`}
						</button>
					</div>
				</div>
			</div>
	        <div style = { {paddingTop:"50px"} }>
				<div className="card-body ibox">
					<ComplianceViewDetail items = { services } item = { facility } />
				</div>
			</div>

		</div>
	)
}

export default CompliancePageIndex
