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

const FileExplorer = React.createClass( {
	mixins: [ ReactMeteorData ],

	getMeteorData() {
		return {

		}
	},

	getInitialState() {
        return {
			uploadNewFile: this.props.uploadNewFile
        }
    },


	handleChange( index, newValue ) {
		let attachments = this.props.value || [];
		if ( newValue ) {
			attachments[ index ] = {
				_id: newValue._id,
				type: newValue.type
			}
		} else {
			attachments.splice( index, 1 );
		}
		this.props.onChange( attachments )
	},

	componentWillReceiveProps(props){
	    this.setState({
			uploadNewFile: props.uploadNewFile
		})
	},

	render() {
		let attachments = this.props.value || [],
			errors		= this.props.errors;
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
							<FileView item = { file } onChange = { (newFile) => { this.handleChange( idx, newFile ) } } uploadFieldName={this.props.uploadFieldName}/>
						</div>
					)
				} ) }

				<div style = { {display:"inline-block"} }>
					{this.state.uploadNewFile ? null : <FileView
						onChange = { (newFile) => { this.handleChange( attachments.length, newFile ) } }
						drop = { (drop) => {
							onDropCallback = drop
						}}
						drag = { (drag) => {
							onDragOverCallback = drag
						} }
						uploadFieldName={this.props.uploadFieldName}
					/>}

				</div>
				{
					errors?
					<div className="invalid" style = {{color:"#dd2c00"}}>{ errors[0] }</div>
					:null
					}

				</div>
			)
	}
} )

export default FileExplorer;
/*function FileExplorer( props ) {
	console.log(props,"1111111");
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

	let attachments = props.value || [],
		errors		= props.errors;

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
					<FileView item = { file } onChange = { (newFile) => { handleChange( idx, newFile ) } } fieldName={props.fieldName}/>
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
				fieldName={props.fieldName}
				/>
		</div>
		{
			errors?
			<div className="invalid" style = {{color:"#dd2c00"}}>{ errors[0] }</div>
			:null
			}

		</div>
	)
}*/
