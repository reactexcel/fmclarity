/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";

import DocViewEdit from './DocViewEdit.jsx';

import { DocActions } from '/modules/models/Documents';

import { Switch } from '/modules/ui/MaterialInputs';

import { Documents } from '/modules/models/Documents';

export default function DocIcon( props ) {

	function showFileDetailsModal() {
		Modal.show( {
			content: <DocViewEdit
				item = { props.item }
				onChange = { (data) => { props.onChange(data); }}
				model={props.model}
				selectedItem={props.selectedItem}
				team = {props.team}/>
		} )
	}

function removeDocumentFromList( docToRemove ) {
	let team = facility = null,
		modelName = props.model._name;
	if (modelName == "Facilities") {
		facility = Session.getSelectedFacility();
		facility.removeDocument( docToRemove );
	} else if ( modelName == "Teams" ) {
		team = Session.getSelectedTeam();
		team.removeDocument( docToRemove );
	}
	props.handleListUpdate( docToRemove );
}

	function getColorFromString( str ) {
		var r = ( str.charCodeAt( str.length - 3 ) % 25 ) * 10;
		var g = ( str.charCodeAt( str.length - 2 ) % 25 ) * 10;
		var b = ( str.charCodeAt( str.length - 1 ) % 25 ) * 10;
		return 'rgb(' + r + ',' + g + ',' + b + ')';
	}

	function handleClick() {
		showFileDetailsModal();
	}

	function runaction( item ){
		if ( item.verb ) {
			if ( item.verb.shouldConfirm ) {
				var message = confirm( item.label + ". Are you sure?" );
				if ( message != true ) {
					return;
				}
			}
		}
		item.run( );
	}

	let item = props.item;
		if ( item ) {
			item = Documents.findOne( { "_id": props.item._id } );
		}
	if ( item == null ) {
		return (
			<div style={{padding:"14px 24px 14px 24px",borderBottom:"1px solid #eee",cursor:"pointer"}} onClick={handleClick}>
			<span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}><i className="fa fa-plus"></i></span>
			<span style={{display:"inline-block",width:"90%",minWidth:"20px",fontStyle:"italic"}}>Add document</span>
		</div>
		)
	}
	let color = "#000";
	if ( item.type ) {
		color = getColorFromString( item.type );
	}
	return (
		<div>
		{ _.contains([ 'facility manager', 'fmc support', "portfolio manager" ], props.role ) || !item.private ?
		<div style={{padding:"14px 24px 14px 24px",borderBottom:"1px solid #eee",overflow:"hidden",cursor:"pointer"}} onClick={handleClick}>
			<span style={{display:"inline-block",minWidth:"18px",color:color,paddingRight:"24px"}}><i className="fa fa-file"></i></span>
			<span style={{display:"inline-block",width:"20%",minWidth:"20px",whiteSpace:"nowrap"}}>{item.type||'-'}</span>
			<span style={{display:"inline-block",width:"20%",minWidth:"20px",whiteSpace:"nowrap",paddingLeft:"10px"}}>{item.name||'-'}</span>
			<span style={{display:"inline-block",width:"40%",minWidth:"20px",whiteSpace:"nowrap",color:"#999",fontStyle:"italic",paddingLeft:"10px"}}>{item.description||'-'}</span>
			{/*<span style={{display:"inline-block",width:"7%",minWidth:"20px",whiteSpace:"nowrap",textDecoratin:"underline",paddingLeft:"10px"}}>{item.request||'-'}</span>*/}
			{ _.contains(['fmc support', "portfolio manager" ], props.role ) ?
				<span style={{display:"inline-block",width:"5%",minWidth:"15px",whiteSpace:"nowrap",textDecoratin:"underline",paddingLeft:"0px"}}>
				<button
					type 		= "button"
					className 	= "btn btn-flat"
					title="Remove"
					onClick={
						( event ) => {
							event.stopPropagation();
							if(props.handleListUpdate){
								removeDocumentFromList( item );
							} else {
								runaction( DocActions.destroy.bind(props.team, item ) );
								props.onChange();
							}
						}
					}>
					<span>&times;</span>
				</button>
			</span> : null }
			{ _.contains([ 'facility manager', 'fmc support', "portfolio manager" ], props.role ) ?
				<span onClick={e => e.stopPropagation()} style={{display:"inline-block",width:"5%",minWidth:"20px",whiteSpace:"nowrap",textDecoratin:"underline",paddingLeft:"10px"}}>
					<Switch
						value={item.private}
						placeholder={item.private?"Hidden":"Visible"}
						onChange={
							( checked ) => {
								runaction( DocActions.makePrivate.bind(props.team, item, checked ) );
								props.onChange();
							}
						}
    			/>
			</span> : null }
		</div>:null}
	</div>
	)
}
