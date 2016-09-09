import React from "react";
import { mount } from 'react-mounter';
import { ReactMeteorData } from 'meteor/react-meteor-data';

if ( Meteor.isClient ) {
	loggedIn.route( '/services', {
		name: 'services',
		action() {
			mount( MainLayout, { content: <ServicePageIndex/> } )
		}
	} );
}

ServicePageIndex = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		Meteor.subscribe( 'teamsAndFacilitiesForUser' );
		var data = {};
		data.facility = Session.getSelectedFacility();
		if ( data.facility ) {
			data.items = _.filter( data.facility.servicesRequired, ( svc ) => {
				return svc.data && svc.data.complianceRules && svc.data.complianceRules.length } );
		}
		return data;
	},

	render() {
		return <ServicePageIndexInner 
			item={this.facility}
			items={this.data.items}
		/>
	}

} );

class ServicePageIndexInner extends React.Component {

	render() {

		return (
			<div className="facility-page animated fadeIn">

		        {/*<FacilityFilter/>*/}
		        <div style={{paddingTop:"50px"}}>
					<div className="card-body ibox">
						<ServiceViewDetail items={this.props.items} item={this.props.item}/>
					</div>
				</div>

			</div>
		);
	}

}
