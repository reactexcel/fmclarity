/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';

import { Menu } from '/modules/ui/MaterialNavigation';
import { Tabs } from '/modules/ui/Tabs';
import { Inbox } from '/modules/models/Messages';
import { PMPList } from '/modules/features/Compliance';
import { Actions } from '/modules/core/Actions';
import { AutoForm } from '/modules/core/AutoForm';
import { AreasEditor } from '/modules/mixins/Areas';
import { RequestsTable } from '/modules/models/Requests';
import { ServicesRequiredEditor } from '/modules/mixins/Services';
import { ContactDetails, ContactList } from '/modules/mixins/Members';
import { Facilities, FacilityActions } from '/modules/models/Facilities';

import FacilityStepper from './FacilityStepper.jsx';

/**
 * @class 			FacilityPanel
 * @memberOf		module:models/Facilities
 */
function FacilityPanel( { item } ) {

	let facility = item,
		teamType = Session.get('selectedTeam').type,
		role = Meteor.user().getRole(),
		menuItems = [];
	let actionNames = Object.keys( FacilityMenuActions.actions ),
		validActions = Actions.filter( actionNames, facility );


	for( actionName in validActions ) {
		let action = validActions[ actionName ];
		menuItems.push( action.bind( facility ) );
	}

	return (
		<div>
			<div className="facility-card">

				{/* standfirst, banner??? */}
				<div className="contact-thumbnail">

					{ facility.thumbUrl ?
					<div className = "cover-image" style = { {backgroundImage:"url('"+facility.thumbUrl+"')"} }></div>
					: null }

					<div className="title-overlay">
						<div className="row">
							<div className="col-md-4">
								<div
									className = "facility-title"
									style = { {borderBottom:facility.contact?"1px solid #fff":"none"} }>

									<div style = { { fontSize:"20px", color:"#fff", cursor: "pointer" } }>
										<i className = "fa fa-arrow-left" onClick = { () => {
											Session.selectFacility( null );
										} }/>
									</div>

									<h2 style = { { marginTop: "20px" }}> { facility.name } </h2>

									{ facility.address ?
									<b>{facility.getAddress()}</b>
									: null }

								</div>
								<ContactDetails item = { facility.contact }/>
							</div>
						</div>
					</div>
				</div>

				{/* tabs - this it the part that can be data driven using autoform */}
				<Tabs tabs = { [
					{
						hide:       !facility.canGetMessages(),
						tab:        <span id="discussion-tab">Updates</span>,
						content:    <Inbox for = { facility } truncate = { true }/>
					},{
						hide:     	!facility.canAddDocument() || teamType!='fm',
						tab:        <span id="documents-tab">Documents</span>,
						content:    <AutoForm model = { Facilities } item = { facility } form = { ["documents"] } hideSubmit = { true }/>
					},{
						hide:       !facility.canAddMember() || role == "caretaker",
						tab:        <span id="personnel-tab">Personnel</span>,
						content:    <ContactList group = { facility } filter = { {role: {$in: ["staff","manager"] } } } defaultRole = "staff" team = { facility.team }/>
					},{
						hide:       !facility.canAddTenant()||teamType!='fm',
						tab:        <span id="tenants-tab">Tenants</span>,
						content:    <ContactList group = { facility } filter = { {role: {$in: ["tenant","resident"] } } } defaultRole = "tenant" team = { facility.team }/>
					},{
						hide:       !facility.canSetAreas() || role == "caretaker",
						tab:        <span id="areas-tab">Areas</span>,
						content:    <AreasEditor item = { facility }/>
					},{
						hide:       !facility.canSetServicesRequired(),
						tab:        <span id="services-tab">Services</span>,
						content:    <ServicesRequiredEditor item = { facility } field = { "servicesRequired" }/>
					},{
						hide:     	!facility.canAddPMP()||teamType!='fm'|| role == "caretaker",
						tab:        <span id="pmp-tab">PPM</span>,
						content:    <PMPList filter = { {"facility._id":facility._id} }/>
					},{
						hide:     	teamType!='fm',
						tab:        <span id="requests-tab">Requests</span>,
						content:    <RequestsTable filter = { {"facility._id":facility._id} }/>
					}
				] } />
			</div>

			<Menu items = { menuItems } />

		</div>
	)
}

export default FacilityPanel;
