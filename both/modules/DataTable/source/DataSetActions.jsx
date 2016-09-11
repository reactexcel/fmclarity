import React from 'react';
import DataSet from './DataSet.jsx';

function download( dataset ) {
	return {
		label: "Download",
		authentication: true,
		action: () => {
			dataset.download();
		},
		notification: () => {
			///blah
		}
	}
}

function print( dataset ) {
	return {
		label: "Print",
		authentication: true,
		action: () => {
			dataset.print();
		},
		notification: () => {
			///blah
		}
	}
}

export {
	download,
	print
}
