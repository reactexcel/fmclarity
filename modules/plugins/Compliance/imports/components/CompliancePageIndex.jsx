import React from "react";
import { mount } from 'react-mounter';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import ComplianceViewDetail from './ComplianceViewDetail.jsx';
import { FacilityFilter } from '/modules/models/Facility';

export default CompliancePageIndex = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		Meteor.subscribe( 'Teams' );
		Meteor.subscribe( 'Facilities' );
		
		var data = {};
		data.facility = Session.getSelectedFacility();
		if ( data.facility ) {
			data.items = _.filter( data.facility.servicesRequired, ( svc ) => {
				return svc.data && svc.data.complianceRules && svc.data.complianceRules.length } );
		}
		return data;
	},

	render() {
		return <CompliancePageIndexInner 
			team = { Session.getSelectedTeam() }
			item = { this.facility }
			items = { this.data.items }
		/>
	}

} );

function CompliancePageIndexInner( props ) {
	return (
		<div className = "facility-page animated fadeIn">

	        <FacilityFilter team = { props.team }/>
	        <div style = { {paddingTop:"50px"} }>
				<div className="card-body ibox">
					<ComplianceViewDetail items = { props.items } item = { props.item } />
				</div>
			</div>

		</div>
	)
}
