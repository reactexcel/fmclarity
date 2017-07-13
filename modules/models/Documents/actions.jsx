import React from 'react';

import { Modal } from '/modules/ui/Modal';
import DocViewEdit from './imports/components/DocViewEdit.jsx';

import { Action } from '/modules/core/Actions';
import { Documents } from '/modules/models/Documents';
import { TeamActions, Teams } from '/modules/models/Teams';
import { Requests } from '/modules/models/Requests';
import { AutoForm } from '/modules/core/AutoForm';
import { DropFileContainer } from '/modules/ui/MaterialInputs';

import moment from 'moment';

function create( doc ) {
	return {
		name: "create document",
		label: "Create document",
		action: ( doc ) => {
			let newDocument = Documents.create( doc );
			Modal.show( {
				content: <DocViewEdit item = { newDocument }/>
			} )
		}
	}
}

function edit( doc ) {
	return {
		name: "edit document",
		label: "Edit document",
		action: () => {
			Modal.show( {
				content: <DocViewEdit item = { doc }/>
			} )
		}
	}
}

const destroy = new Action( {
	name: "destroy document",
	type: 'document',
	label: "Delete document",
	shouldConfirm: true,
	verb:  {
		shouldConfirm: true,
	},
	action: ( team, doc ) => {
		if( !doc.destroy ){
			doc = Documents.findOne( doc._id );
		}
		doc.destroy();
	}
} )

const makePrivate = new Action( {
	name: "private document",
	type: 'document',
	label: "Private document",
	action: ( team, doc, private ) => {
		doc = Documents.findOne( doc._id );
		doc && doc.makePrivate(private);
	}
} )

const createUpdateRequest = new Action( {
	name: "create document update request",
	label: "Create document update request",
	type: 'request',
	action: ( doc ) => {
		 team = Session.getSelectedTeam();
         let owner = team.getOwner(),
         supplier = {
                        _id: owner._id,
                        name: owner.profile ? owner.profile.name : owner.name
                    };
		let item = Requests.create( {
                    team: team,
                    type: 'Reminder',
                    priority: 'Urgent',
                    dueDate: doc.dueDate,
                    name: "Update "+doc.name+'. Expiry: '+moment(doc.expiryDate).format('YYYY-MM-DD')+' ('+doc.type+' document)',
                    service: doc.serviceType ? doc.serviceType : null,
                    supplier: supplier,
                    // supplier: doc.serviceType && doc.serviceType.data && doc.serviceType.data.supplier ? doc.serviceType.data.supplier : null
                } );
		newItem = Requests.create( item );
        Modal.show( {
            content: <AutoForm
            title = "Please tell us what needs to be updated."
            model = { Requests }
            form = { CreateDocUpdateRequestForm  }
            item = { newItem }
            onSubmit = {
                ( newRequest ) => {
                    Modal.replace( {
                        content: <DropFileContainer model={Requests} request={request}>
                                <RequestPanel item = { newRequest }/>
                            </DropFileContainer>
                    } );

                    let owner = Meteor.user();

                    newRequest.owner = {
                        _id: owner._id,
                        name: owner.profile ? owner.profile.name : owner.name
                    };

                    /*this seems to override supplier selected by user at supplier dropdown
                    newRequest.supplier = {
                        _id: owner._id,
                        name: owner.profile ? owner.profile.name : owner.name
                    };*/

                    // this is a big of a mess - for starters it would be better placed in the create method
                    //  and then perhaps in its own function "canAutoIssue( request )"
                    let hasSupplier = newRequest.supplier && newRequest.supplier._id,
                        method = 'Issues.create';

                    if ( newRequest.type != 'Preventative' && hasSupplier ) {

                        let team = Teams.findOne( newRequest.team._id ),
                            role = Meteor.user().getRole( team ),
                            baseBuilding = ( newRequest.service && newRequest.service.data && newRequest.service.data.baseBuilding );

                        if( !team ) {
                            throw new Meteor.Error( 'Attempted to issue request with no requestor team' );
                            return;
                        }
                        else if( baseBuilding ) {

                            if( role == 'property manager' ) {
                                method = 'Issues.issue';
                            }
                        }
                        else if( !baseBuilding ) {

                            if( _.contains( [ 'portfolio manager', 'fmc support' ], role ) ) {
                                method = 'Issues.issue';
                            }
                            else if( _.contains( [ 'manager', 'caretaker' ], role )) {

                                method = 'Issues.issue';
                                let relation = team.getMemberRelation( owner ),
                                    costString = newRequest.costThreshold,
                                    costThreshold = null;

                                // strips out commas
                                //  this is a hack due to an inadequete implementation of number formatting
                                //  needs a refactor
                                if( _.isString( costString ) ) {
                                    costString = costString.replace(',','')
                                }

                                let cost = parseInt( costString );

                                if( relation.threshold ) {
                                    costThreshold = parseInt( relation.threshold );
                                }
                                else if( team.defaultCostThreshold ) {
                                    costThreshold = parseInt( team.defaultCostThreshold );
                                }

                                if( cost > costThreshold ) {
                                    method = 'Issues.create';
                                }

                            }
                        }
                    }

                    Meteor.call( method, newRequest );
                    let request = Requests.findOne( { _id: newRequest._id } );
                    request.markAsUnread();
                    let docRequest = {
                    	_id: newRequest._id,
                    }
                    doc.serviceType.data.request = docRequest;
                    Documents.save.call(doc);
                    //callback( newRequest );
                }
            }
            />
        } )
	}
})

export {
	create,
	edit,
	destroy,
	makePrivate,
	createUpdateRequest
}
