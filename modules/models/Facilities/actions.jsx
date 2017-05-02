import React from 'react';

import { Action } from '/modules/core/Actions';
import { Modal } from '/modules/ui/Modal';

import { Facilities } from '/modules/models/Facilities';
import { TeamStepper, Teams } from '/modules/models/Teams';

import FacilityStepperContainer from './imports/containers/FacilityStepperContainer.jsx';
import FacilityPanel from './imports/components/FacilityPanel.jsx';
import { Select } from '/modules/ui/MaterialInputs';
import { ContactCard } from '/modules/mixins/Members';
import { DropFileContainer } from '/modules/ui/MaterialInputs';

const edit = new Action( {
	name: "edit facility",
	type: 'facility',
	label: "Edit facility",
	action: ( facility ) => {
		Modal.show( {
			content: <DropFileContainer model={Facilities}>
				<FacilityStepperContainer params = { { item: facility } } />
			</DropFileContainer>
		} )
	}
} )

const view = new Action( {
	name: "view facility",
	path: "/facility",
	type: 'facility',
	label: "View facility",
	action: ( facility ) => {
		Modal.show( {
			content: <DropFileContainer model={Facilities}>
				<FacilityPanel item = { facility } />
			</DropFileContainer>
		} )
	}
} )

const destroy = new Action( {
	name: "destroy facility",
	type: 'facility',
	label: "Delete facility",
	shouldConfirm: true,
	verb:  {
		shouldConfirm: true,
	},
	action: ( facility ) => {
		//Facilities.destroy( facility );
		facility.destroy();
	}
} )

const createPropertyManager = new Action( {
 	name: 'create property manager',
	type: 'facility',
 	label: 'create property manager',
 	action: ( facility, callback ) => {
		import { Teams, TeamStepper } from '/modules/models/Teams';
		let team = Teams.create();
			team.facilities = team.facilities || [];
			team.facilities.push(_.pick(facility, "_id", "name"));
		Modal.show( {
			content: <TeamStepper
				item = { team }
				role={"property manager"}
				teamType={"real estate"}
				title="Real Estate Agency"
				onChange={ ( item ) => {
					let facility = Session.getSelectedFacility();
					Meteor.call("Facilities.updateRealEstateAgency", facility, item, (err, facility ) => {
							callback( facility )
						});
					}
				}
				/>
		} )


		// let realEstateAgency = Teams.findAll( { "type": "real estate"} );
		// console.log({facility, callback});
		// 	Modal.show({
		// 		content:
		// 		<div className="row">
		// 			<div className="col-sm-12">
		// 				<div style={{paddingBottom: "10px",paddingRight:"10px", paddingLeft:"20px"}}>
		// 					<Select
		// 						placeholder="Select Real Estate Agency"
		// 						items={realEstateAgency}
		// 						view={ContactCard}
		// 						onChange={(item)=>{
		//
		// 						}}
		// 						addNew={{
		// 							show: !_.contains(['resident', 'staff'], Meteor.user().getRole()),
		// 							label: "Add New Real Estate Agency",
		// 							onAddNewItem: ( callback ) => {
		//
		// 							}
		// 						}}
		// 						/>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	})
 		}
	} )

export {
	edit,
	view,
	destroy,
	createPropertyManager,
}
