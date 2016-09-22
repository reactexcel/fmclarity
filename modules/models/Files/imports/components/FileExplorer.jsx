/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import FileView from './FileView.jsx';

/**
 * @class 			FileExplorer
 * @memberOf 		module:models/Files
 */
function FileExplorer( props ) {

	function handleChange( index, newValue ) {
		let attachments = props.value || [];

		if ( newValue ) {
			attachments[ index ] = {
				_id: newValue._id,
				type: newValue.type
			}
		} else {
			attachments.splice( index, 1 );
		}
		props.onChange( attachments )
	}

	let attachments = props.value || [];

	return (
		<div>
		{ attachments.map( ( file, idx ) => {
			return (
				<div key={idx} style={{display:"inline-block"}}>
					<FileView item = { file } onChange = { () => { handleChange( idx ) } } />
				</div>
			)
		} ) } 
		
		<div style = { {display:"inline-block"} }>
			<FileView onChange = { () => { handleChange( attachments.length ) } } />
		</div>
	
		</div>
	)
}

export default FileExplorer;
