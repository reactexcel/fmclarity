import React from 'react';

import { Modal } from '/modules/ui/Modal';
import DocViewEdit from './imports/components/DocViewEdit.jsx';

import { Action } from '/modules/core/Actions';
import { Documents } from '/modules/models/Documents';
import { TeamActions } from '/modules/models/Teams';
import { Requests } from '/modules/models/Requests';

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
		let newRequest = Requests.create( {
                    team: team,
                    type: 'Reminder',
                    priority: 'Urgent',
                    name: "Update "+doc.name+' ('+doc.type+' document)'
                } );
		TeamActions.createRequest.bind( team, null, newRequest ).run();
	}
})

export {
	create,
	edit,
	destroy,
	makePrivate,
	createUpdateRequest
}
