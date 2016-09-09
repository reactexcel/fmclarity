import React from "react";

export default function DocIconHeader( props ) {
	return (
		<div style={{padding:"14px 24px 14px 24px",borderBottom:"1px solid #ddd",backgroundColor:"#eee",fontWeight:"bold"}}>
			<span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}>&nbsp;</span>
			<span style={{display:"inline-block",width:"20%",minWidth:"20px"}}>Type</span>
			<span style={{display:"inline-block",width:"20%",minWidth:"20px",paddingLeft:"10px"}}>Name</span>
			<span style={{display:"inline-block",width:"50%",minWidth:"20px",paddingLeft:"10px"}}>Description</span>
		</div>
	)
}

