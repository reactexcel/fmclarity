import React from 'react';

import { Modal } from '/both/modules/Modal';
import DocViewEdit from './source/components/DocViewEdit.jsx';

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
	edit
}
