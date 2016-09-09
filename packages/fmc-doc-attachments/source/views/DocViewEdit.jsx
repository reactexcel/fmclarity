import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { AutoForm } from 'meteor/fmc:autoform';
import Documents from '../model/Documents.jsx';
import DocumentSchema from '../model/DocumentSchema.jsx';

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
					form 	= { DocumentSchema } 
					item 	= { this.data.doc } 
				/>
			</div>
		)
	}
} )
