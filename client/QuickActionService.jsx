import React from 'react';

import { AutoForm } from '/both/modules/AutoForm';
import { FacilityStepper } from '/modules/models/Facility';
import { RequestPanel, CreateRequestForm } from '/modules/models/Request';
import { Modal } from '/both/modules/Modal';

export default QuickActions = new function QuickActionService() {

	function createFacility( template = {} ) {
		Modal.show( {
			content: <FacilityStepper facility = { Facilities.create( template ) } />
		} )
	}

	function viewFacility( facility ) {
		Model.show( {
			content: <FacilityPanel item = { facility } />
		})
	}

	function editFacility( facility ) {
		Modal.show( {
			content: <FacilityStepper facility = { facility } />
		} )
	}

	function deleteFacility( facility ) {
		facility.destroy();
	}

	function viewRequest( request ) {
		Modal.show( {
			content: <RequestPanel item = { request } />
		} )
	}

	function editTeam( team ) {
		Modal.show( {
			content: <TeamStepper item = { team } />
		} )
	}

	function createRequest( template = {} ) {
		//look below at new compliance rule created with AutoForm, that is the way to do this...
		let selectedFacility = Session.getSelectedFacility(),
			selectedTeam = Session.getSelectedTeam(),
			request = Object.assign( {
				type: 'Ad Hoc',
				team: selectedTeam,
				facility: selectedFacility,
				priority: 'Standard',
				dueDate: new Date(),
				costThreshold: selectedTeam.defaultWorkOrderValue
			}, template );


		Modal.show( {
			/*content: 	<AutoForm 
							form = { Issues.forms.newRequest } 
							afterSubmit = ( error, response ) => {
								if( error==null ) {
									Modal.replace( {
										content: <RequestPanel item = { response } />
									})
								}
							}
						/>
			*/
			content: <AutoForm
				model = { Issues }
				// not a good choice of propname because it classhes with schema[ fieldName ].options
				form = { CreateRequestForm }
				onSubmit = {
					( request, form ) => {
						Meteor.call( 'Issues.create', request, {}, ( err, response ) => {
							Modal.replace( {
								content: <RequestPanel item = { response }/>
							} );
						} );
					}
				}
			/>
		} )

		//request = Issues._transform(request);
		//request.doAction("create");	    
		/*
		Meteor.call('Issues.create',request,function(err,response){
			if(err) {
				console.log(err);
			}
			if(response) {
				var newRequest = Issues.findOne(response._id);
				newRequest.doAction("create");
			}
		});
		*/
	}

	/*
	function createFacility() {
		var selectedTeam = Session.getSelectedTeam();
		selectedTeam.addFacility( ( response ) => {
			var newItem = Facilities.findOne( response._id );
			newItem.setupCompliance( Config.compliance );
			Modal.show( {
				content: <FacilityStepper item={newItem} />
			} );
		} )
	}
	*/
	function createNewComplianceRule( newRule ) {
		var facility = newRule.facility;
		if ( facility ) {
			var services = facility.servicesRequired;
			//get index of the selected service
			var idx = -1;
			for ( var i in services ) {
				if ( services[ i ].name == newRule.service.name ) {
					idx = i;
					break;
				}
			}
			if ( idx >= 0 ) {
				var service = services[ idx ];
				console.log( {
					service,
					idx
				} );
				if ( !service.data ) {
					service.data = {};
				}
				if ( !service.data.complianceRules ) {
					service.data.complianceRules = [];
				}
				//to avoid circular search remove facility and then add with just name and _id
				var copy = _.omit( newRule, 'facility', 'service' /*,'event'*/ );
				if ( newRule.facility ) {
					copy.facility = _.pick( newRule.facility, 'name', '_id' );
				}
				/*if(newRule.event) {
					copy.event = _.pick(newRule.event,'name','_id');
				}*/
				if ( newRule.service ) {
					copy.service = _.pick( newRule.service, 'name' );
				}
				service.data.complianceRules.push( copy );
				services[ idx ] = service;
			}
			facility.setServicesRequired( services );
		}
		Modal.hide();
	}

	function createComplianceRule() {
		Modal.show( {
			content: <AutoForm
				item = { { facility: Session.getSelectedFacility() } }
				form = { ComplianceRuleSchema }
				onSubmit = { createNewComplianceRule }
			/>
		} )
	}

	return {
		createFacility,
		viewFacility,
		editFacility,
		deleteFacility,
		viewRequest,
		editTeam,
		createRequest,
		createFacility,
		createComplianceRule
	}
}
