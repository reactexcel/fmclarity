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

let onDragOverCallback = onDropCallback = null;

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
		<div className="col-sm-12 dragdrop" style={{
			border: "none"
		}}
		onDrop={(e) => {
			e.preventDefault();
			e.stopPropagation();
				if (onDropCallback) {
					onDropCallback(e);
				}
			}
		}
		onDragOver={(e) => {
			e.preventDefault();
			e.stopPropagation();
				if (onDragOverCallback) {
					onDragOverCallback(e);
				}
			}
		}
		>
		{ attachments.map( ( file, idx ) => {
			return (
				<div key={idx} style={{display:"inline-block"}}>
					<FileView item = { file } onChange = { (newFile) => { handleChange( idx, newFile ) } } />
				</div>
			)
		} ) }

		<div style = { {display:"inline-block"} }>
			<FileView
				onChange = { (newFile) => { handleChange( attachments.length, newFile ) } }
				drop = { (drop) => {
					onDropCallback = drop
				}}
				drag = { (drag) => {
					onDragOverCallback = drag
				} }
				/>
		</div>

		</div>
	)
}

export default FileExplorer;
