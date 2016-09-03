import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

DocViewEdit = React.createClass(
{

	mixins: [ ReactMeteorData ],

	getMeteorData()
	{
		var doc = this.props.item || {};
		if ( doc && doc._id )
		{
			doc = Documents.findOne( doc._id );
		}
		return {
			doc: doc
		}
	},

	downloadFile()
	{
		var win = window.open( this.data.url, '_blank' );
		win.focus();
	},

	deleteDoc()
	{
		var message = confirm( 'Are you sure you want to delete this file?' );
		if ( message == true )
		{
			this.data.file.remove();
			this.data.meta.destroy();
			Modal.hide();
			this.props.onChange( null );
		}
	},

	handleChangeCallback( error, item )
	{
		if ( !error && this.props.onChange )
		{
			this.props.onChange(
			{
				name: item.name,
				description: item.description,
				type: item.type,
				_id: item._id
			} )
		}
	},

	handleChange( item )
	{
		if ( !item._id )
		{
			item = Meteor.call( 'Files.create', item, this.handleChangeCallback );
		}
		else
		{
			item.save();
			this.handleChangeCallback( null, item );
		}
	},

	render()
	{
		var doc = Documents._transform( this.data.doc );
		return (
			<div style={{padding:"15px"}}>
				<AutoForm schema={DocumentSchema} item={doc} save={this.handleChange}/>
				<div style={{paddingTop:"20px",textAlign:"right"}}>
    	           	{/*<button style={{marginLeft:"5px"}} type="button" className="btn btn-flat btn-danger" onClick={this.deleteDoc} >Delete</button>*/}
    	           	<button style={{marginLeft:"5px"}} type="button" className="btn btn-flat btn-primary" onClick={Modal.hide}>Done</button>
    	        </div>
			</div>
		)
	}
} )
