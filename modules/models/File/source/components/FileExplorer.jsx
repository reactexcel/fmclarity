import React from "react";

import FileView from './FileView.jsx';

export default function FileExplorer( props ) {

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

