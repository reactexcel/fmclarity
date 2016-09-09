import React from "react";

export default function DocumentIcon( { item as doc } ) {

	function showFileDetailsModal() {
		Modal.show( {
			content: <DocViewEdit item={this.props.item} onChange={this.props.onChange}/>
		} )
	}

	function getColorFromString( str ) {
		var r = ( str.charCodeAt( str.length - 3 ) % 25 ) * 10;
		var g = ( str.charCodeAt( str.length - 2 ) % 25 ) * 10;
		var b = ( str.charCodeAt( str.length - 1 ) % 25 ) * 10;
		return 'rgb(' + r + ',' + g + ',' + b + ')';
	}

	function handleClick() {
		this.showFileDetailsModal();
	}

	if ( !doc ) {
		return (
			<div style={{padding:"14px 24px 14px 24px",borderBottom:"1px solid #eee",cursor:"pointer"}} onClick={handleClick}>
			<span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}><i className="fa fa-plus"></i></span>
			<span style={{display:"inline-block",width:"90%",minWidth:"20px",fontStyle:"italic"}}>Add document</span>
		</div>
		)
	}
	var color = "#000";
	if ( doc.type ) {
		color = getColorFromString( doc.type );
	}
	return (
		<div style={{padding:"14px 24px 14px 24px",borderBottom:"1px solid #eee",overflow:"hidden",cursor:"pointer"}} onClick={handleClick}>
			<span style={{display:"inline-block",minWidth:"18px",color:color,paddingRight:"24px"}}><i className="fa fa-file"></i></span>
			<span style={{display:"inline-block",width:"20%",minWidth:"20px",whiteSpace:"nowrap",backgroundColor:"#fff"}}>{doc.type||'-'}</span>
			<span style={{display:"inline-block",width:"20%",minWidth:"20px",whiteSpace:"nowrap",backgroundColor:"#fff",paddingLeft:"10px"}}>{doc.name||'-'}</span>
			<span style={{display:"inline-block",width:"50%",minWidth:"20px",whiteSpace:"nowrap",backgroundColor:"#fff",color:"#999",fontStyle:"italic",paddingLeft:"10px"}}>{doc.description||'-'}</span>
		</div>
	)
}
