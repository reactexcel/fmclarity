/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { AutoForm } from '/modules/core/AutoForm';
import { Documents } from '/modules/models/Documents';
import DocumentSchema from '../schemas/DocumentSchema.jsx';
import { Facilities } from '/modules/models/Facilities';
/**
 * @class 			DocViewEdit
 * @memberOf 		module:models/Documents
 */
const DocViewEdit = React.createClass( {

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
		let selectedFacility = Session.getSelectedFacility();
		if ( !item._id ) {
			Documents.save.call( item, {}, this.handleChangeCallback );
			item = Meteor.call( 'Files.create', item, this.handleChangeCallback );
		} else {
			Meteor.call( 'Facilities.addDocument',
				selectedFacility._id,
				item,
				this.handleChangeCallback
			);
		}
	},

	render() {
		return (
			<div style={{padding:"15px"}}>
				<AutoForm
					model 	= { Documents }
					form 	= { DocumentSchema }
					item 	= { this.data.doc }
					onSubmit = { this.handleChange  }
				/>
			</div>
		)
	}
} )

export default DocViewEdit;
