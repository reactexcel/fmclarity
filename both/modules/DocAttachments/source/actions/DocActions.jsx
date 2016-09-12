import React from 'react';

import { Modal } from '/both/modules/Modal';
import DocViewEdit from '../components/DocViewEdit.jsx';

function edit( doc ) {
	return {
		label: "Edit",
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
