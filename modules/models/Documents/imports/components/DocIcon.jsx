/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";

import DocViewEdit from './DocViewEdit.jsx';

export default function DocIcon( props ) {

	function showFileDetailsModal() {
		Modal.show( {
			content: <DocViewEdit item = { props.item } onChange = { (data) => { props.onChange(data); onChange() }}/>
		} )
	}

	function onChange(){
		Modal.hide();
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

	let item = props.item;
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
		<div style={{padding:"14px 24px 14px 24px",borderBottom:"1px solid #eee",overflow:"hidden",cursor:"pointer"}} onClick={handleClick}>
			<span style={{display:"inline-block",minWidth:"18px",color:color,paddingRight:"24px"}}><i className="fa fa-file"></i></span>
			<span style={{display:"inline-block",width:"20%",minWidth:"20px",whiteSpace:"nowrap"}}>{item.type||'-'}</span>
			<span style={{display:"inline-block",width:"20%",minWidth:"20px",whiteSpace:"nowrap",paddingLeft:"10px"}}>{item.name||'-'}</span>
			<span style={{display:"inline-block",width:"50%",minWidth:"20px",whiteSpace:"nowrap",color:"#999",fontStyle:"italic",paddingLeft:"10px"}}>{item.description||'-'}</span>
		</div>
	)
}
