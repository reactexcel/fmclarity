import React from 'react';

import { Modal } from '/modules/ui/Modal';
import DocViewEdit from './source/components/DocViewEdit.jsx';

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

export {
	create,
	edit
}
