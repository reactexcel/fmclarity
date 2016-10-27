import React from 'react';

import { Modal } from '/modules/ui/Modal';
import DocViewEdit from './imports/components/DocViewEdit.jsx';

import { Action } from '/modules/core/Actions';

function create( doc ) {
	return {
		name: "create document",
		label: "Create document",
		action: ( document ) => {
			let newDocument = Documents.create( document );
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
	action: ( doc ) => {
		doc.destroy();
	}
} )

export {
	create,
	edit,
	destroy
}
