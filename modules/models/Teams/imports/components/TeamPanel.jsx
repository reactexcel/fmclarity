/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Teams } from '/modules/models/Teams';

import { Tabs } from '/modules/ui/Tabs';
import { Menu } from '/modules/ui/MaterialNavigation';

import { ContactList } from '/modules/mixins/Members';
import { ServicesProvidedEditor } from '/modules/mixins/Services';

import { AutoForm } from '/modules/core/AutoForm';

import TeamActions from '../../actions.jsx';


function addTeamMenuItem( menu, item, team ) {
	if ( team ) {
		if ( /*team.hasSupplier( item ) && team.canRemoveSupplier && team.canRemoveSupplier() && team._id != item._id*/ true ) {

			menu.push( {
				label: "Remove supplier from " + team.name,
				shouldConfirm: true,
				action() {
					team.removeSupplier( item );
					Modal.hide();
				}
			} );

		}

		if ( item && item.ownerIs && item.ownerIs( team ) ) {
			var itemName = item.name;
			menu.push( {
				label: "Revoke ownership of " + itemName,
				shouldConfirm: true,
				action() {
					item.clearOwner();
				}
			} )
		}
	}
}

/**
 * @class 			TeamPanel
 * @memberOf 		module:models/Teams
 */
const TeamPanel = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		var team, services, insuranceDocs;
		Meteor.subscribe( 'contractors' );
		Meteor.subscribe( 'teamsAndFacilitiesForUser' );
		team = this.props.item;

		if ( team ) {
			Meteor.subscribe( "messages", "Teams", team._id, moment().subtract( { days: 7 } ).toDate() );
			services = team.getAvailableServices();

			/*
			insuranceDocs = Documents.findAll( {'team._id':team._id, type:'Insurance'} );
			need to migrate schema by moving references out to document

			insuranceDocs = team.getDocs( {
				type: "Insurance"
			} );
			*/

		}
		return {
			services: services,
			insuranceDocs: insuranceDocs
		}
	},

	getMenu() {
		return [ TeamActions.edit.bind( this.props.item ) ];
	},

	render() {
		let team = this.props.item;
		if ( !team ) {
			return <div/>
		}

		let insuranceDocs = this.data.insuranceDocs,
			availableServices = this.data.services,
			contactName = team.contact ? team.contact.name : null;

		let insuranceExpiry;
		if ( insuranceDocs && insuranceDocs.length ) {
			let primaryDoc = insuranceDocs[ 0 ];
			if ( primaryDoc.expiryDate != null ) {
				insuranceExpiry = moment( primaryDoc.expiryDate )
					.format( 'DD/MM/YYYY' );
			}
		}

		return (
			<div>
			{/*this should be in sub-component*/}
			<div className="business-card">{/*should perhaps be team-card?*/}
				<div className="contact-thumbnail pull-left">
					{team.thumbUrl?
						<img alt="image" src={team.thumbUrl} />
					:null}
				 </div>
				 <div className="contact-info">

					<h2>{team.name}</h2>

					<i style={{color:"#999",display:"block",padding:"3px"}}>{ contactName ? contactName : null }<br/></i>
					<b>Email</b> { team.email }<br/>
					{ team.phone ? <span><b>Phone</b> { team.phone }<br/></span> :null }
					{ team.phone2 ? <span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> { team.phone2 }<br/></span> :null }
					{ insuranceExpiry ? <span><b>Insurance Expiry</b> { insuranceExpiry }</span> :null }
					<div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}></div>

					{/*this should def be own component*/availableServices && availableServices.length?

					availableServices.map( (service,index) => {
						return <span key = { service.name }>{ index?' | ':'' }{ service.name }</span>
					})

					:null}
				</div>
			</div>

			<Tabs tabs={[
				{
					//hide: 		!team.canGetMessages(),
					tab: 		<span id = "discussion-tab"><span style = {{color:"black"}}>Updates</span></span>,
					content: 	<Inbox for = { team } readOnly = { true } truncate = { true }/>
				},{
					//hide: 		!team.canAddDocument(),
					tab: 		<span id = "documents-tab"><span style = {{color:"black"}}>Documents</span></span>,
					content: 	<AutoForm model = { Teams } item = { team } form = { ["documents"] } hideSubmit = { true } />
				},{
					//hide: 		!team.canAddMember(),
					tab: 		<span id="personnel-tab"><span style={{color:"black"}}>Personnel</span></span>,
					content: 	<ContactList group = { team } team = { team }/>
				},{
					//hide: 		!team.canSetServicesProvided(),
					tab: 		<span id="services-tab"><span style={{color:"black"}}>Services</span></span>,
					content: 	<ServicesProvidedEditor item = { team } save = { team.setServicesProvided.bind(team) }/>
				}
			]}/>

			<Menu items = { this.getMenu() } />

		</div>
		)
	}
} );

export default TeamPanel;
