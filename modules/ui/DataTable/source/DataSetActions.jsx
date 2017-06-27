import React from 'react';
import DataSet from './DataSet.jsx';

function download( dataset, fileDetails ) {
	return {
		label: "Download",
		authentication: true,
		run: () => {
			dataset.download(fileDetails);
		},
		notification: () => {
			///blah
		}
	}
}

function print( dataset, element, pdfDetails ) {
	let details = pdfDetails ? pdfDetails : ''
	return {
		label: "Print",
		authentication: true,
		run: () => {
			dataset.print(element,details);
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
