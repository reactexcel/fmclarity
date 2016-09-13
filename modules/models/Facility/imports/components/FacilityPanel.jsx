import React from 'react';

import { Menu } from '/both/modules/MaterialNavigation';
import { ContactDetails, ContactList } from '/both/modules/DocMembers';
import { AutoForm } from '/both/modules/AutoForm';
import { Inbox } from '/modules/models/Message';

import FacilityStepper from './FacilityStepper.jsx';
import FacilityAreasEditor from './FacilityAreasEditor.jsx';
import * as Actions from '../actions/FacilityActions.jsx';

import { ServicesRequiredEditor } from '/both/modules/DocServices';
import { PMPList } from '/both/modules/Compliance';

import { Tabs } from '/both/modules/Tabs';

export default function FacilityPanel( { facility } ) {

	//console.log( facility );

	function getMenu() {
		return [
			Actions.viewFacility( facility ),
			Actions.editFacility( facility ),
			Actions.deleteFacility( facility )
		]
	}

	return (
		<div>
			<div className="facility-card">

				{/* standfirst, banner??? */}
				<div className="contact-thumbnail">

					{facility.thumbUrl?
					<div className="cover-image" style={{backgroundImage:"url('"+facility.thumbUrl+"')"}}></div>
					:null}

					<div className="title-overlay">
						<div className="row">
							<div className="col-md-4">
								<div 
									className="facility-title" 
									style={{borderBottom:facility.contact?"1px solid #fff":"none"}}>

									<h2>{facility.name}</h2>                        

									{facility.address?
									<b>{facility.getAddress()}</b>
									:null}

								</div>
								<ContactDetails item={facility.contact}/>
							</div>
						</div>
					</div>
				</div>

				{/* tabs - this it the part that can be data driven using autoform */}
				<Tabs tabs={[
					{
						//hide:       !facility.canGetMessages(),
						tab:        <span id="discussion-tab">Updates</span>,
						content:    <Inbox for = { facility } truncate = { true }/>
					},{
						//hide:       !facility.canAddDocument(),
						tab:        <span id="documents-tab">Documents</span>,
						content:    <AutoForm model = { Facilities } item = { facility } form = { ["documents"] }/>
					},{
						//hide:       !facility.canAddMember(),
						tab:        <span id="personnel-tab">Personnel</span>,
						content:    <ContactList group={facility} filter={{role:{$in:["staff","manager"]}}} defaultRole="staff" team={facility.team}/>
					},{
						//hide:       !facility.canAddMember(),
						tab:        <span id="tenants-tab">Tenants</span>,
						content:    <ContactList group={facility} filter={{role:"tenant"}} defaultRole="tenant" team={facility.team}/>
					},{
						//hide:       !facility.canSetAreas(),
						tab:        <span id="areas-tab">Areas</span>,
						content:    <FacilityAreasEditor item={facility}/>
					},{
						//hide:       !facility.canSetServicesRequired(),
						tab:        <span id="services-tab">Services</span>,
						content:    <ServicesRequiredEditor item = { facility } field = { "servicesRequired" }/>
					},{
						tab:        <span id="pmp-tab">PMP</span>,
						content:    <PMPList filter={{"facility._id":facility._id}}/>
					},{
						tab:        <span id="requests-tab">Requests</span>,
						content:    <RequestsTable filter={{"facility._id":facility._id}}/>
					}
				]} />                
			</div>
			<Menu items={getMenu()} />
		</div>
	)
}
