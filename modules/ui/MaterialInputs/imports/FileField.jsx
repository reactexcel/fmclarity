/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Files } from '/modules/models/Files';
import { Text } from '/modules/ui/MaterialInputs';

/**
 * @class 			FileField
 * @memberOf 		module:ui/MaterialInputs
 */
const FileField = React.createClass( {
	mixins: [ ReactMeteorData ],

	getMeteorData() {

		var query, file, url, extension, icon;
		query = this.props.value;
		file = Files.findOne( query );
		if ( file ) {
			url = file.url();
			extension = file.extension();
			if ( extension ) {
				icon = "icons/" + extension + "-icon-128x128.png";
			}
		}
		return {
			file: file,
			url: file ? file.url() : "img/default-placeholder.png",
			extension: extension,
			icon: icon
		}
	},

	handleChange( event ) {
		FS.Utility.eachFile( event, ( file ) => {
			//Removed callback to decrease the time taken to update text field.
			let newFile = Files.insert( file );
			if ( newFile ) {
				this.props.onChange( {
					_id: newFile._id
				} );
			}
		/*	Files.insert( file, ( err, newFile ) => {
				this.props.onChange( {
					_id: newFile._id
				} );
			} );*/
		} );
	},

	handleSelect() {
		$(this.refs.input).click();
	},

	showImageInModal() {
		Modal.show( {
			content: <img style={{width:"100%","borderRadius":"1px",marginTop:"10px"}} alt="image" src={this.data.url} />
		} )
	},

	onClick() {
		if ( this.data.file ) {
			this.showImageInModal()
		} else {
			$( this.refs.input ).click();
		}
	},

	render() {
		let file = this.data.file,
			fileName = "";
		if ( file ) {
			fileName = file.name();
		}

		return (
		<div>

			<div style 		= { { width: '95%', float: 'right' } }>
				<Text
					placeholder = { this.props.placeholder }
					value 		= { fileName }
					onSelect 	= { this.handleSelect }
					onClear 	= { this.handleClear }
					errors 		= { this.props.errors }
				/>
			</div>

			<i
				style 		= { { float: 'left', position: 'relative', top: '35px' } }
				className 	= "fa fa-paperclip">
			</i>

			<input
				ref 		= "input"
				type 		= "file"
				style 		= { { display:"none" } }
				onChange 	= { this.handleChange }
			/>

		</div>
		)
	}
} );

export default FileField;
