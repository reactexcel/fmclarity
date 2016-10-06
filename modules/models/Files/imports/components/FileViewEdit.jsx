/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { AutoForm } from '/modules/core/AutoForm';
import Files from '../models/Files.jsx';
import FileSchema from '../models/FileSchema.jsx';

/**
 * @class 			FileViewEdit
 * @memberOf 		module:models/Files
 */
const FileViewEdit = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		var doc = this.props.item || {};
		if ( doc && doc._id ) {
			doc = Documents.findOne( doc._id );
		}
		return {
			doc: doc
		}
	},

	downloadFile() {
		var win = window.open( this.data.url, '_blank' );
		win.focus();
	},

	deleteDoc() {
		var message = confirm( 'Are you sure you want to delete this file?' );
		if ( message == true ) {
			this.data.file.remove();
			this.data.meta.destroy();
			Modal.hide();
			this.props.onChange( null );
		}
	},

	handleChangeCallback( error, item ) {
		if ( !error && this.props.onChange ) {
			this.props.onChange( {
				name: item.name,
				description: item.description,
				type: item.type,
				_id: item._id
			} )
		}
	},

	handleChange( item ) {
		if ( !item._id ) {
			Documents.save.call( item, {}, this.handleChangeCallback );
			item = Meteor.call( 'Files.create', item, this.handleChangeCallback );
		} else {
			item.save();
			this.handleChangeCallback( null, item );
		}
	},

	render() {
		return (
			<div style={{padding:"15px"}}>
				<AutoForm
					model 	= { Documents }
					form 	= { DocumentSchema }
					item 	= { this.data.doc }
				/>
			</div>
		)
	}
} )

export default FileViewEdit;
