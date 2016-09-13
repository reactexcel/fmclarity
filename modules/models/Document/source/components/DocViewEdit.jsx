import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { AutoForm } from '/both/modules/AutoForm';
import Documents from '../models/Documents.jsx';
import DocumentSchema from '../models/DocumentSchema.jsx';

export default DocViewEdit = React.createClass( {

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