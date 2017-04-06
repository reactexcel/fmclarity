/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";

export default function DocIconHeader( props ) {
	return (
		<div>
		<table className="pull-right" style={{fontStyle:"italic"}}>
            <tr>
                <td><div style={{height:"18px",width:"18px",background:"#ffffcc"}}></div></td>
                <td style = {{ color: "rgb(153, 153, 153)" }}>Expires within 2 weeks</td>
            </tr>
            <tr>
                <td><div style={{height:"18px",width:"18px",background:"#FFE0E0"}}></div></td>
                <td style = {{ color: "rgb(153, 153, 153)" }}>Expired Document</td>
            </tr>
        </table>
		<div style={{padding:"14px 24px 14px 24px",borderBottom:"1px solid #ddd",backgroundColor:"#eee",fontWeight:"bold"}}>
			<span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}>&nbsp;</span>
			<span style={{display:"inline-block",width:"20%",minWidth:"20px"}}>Type</span>
			<span style={{display:"inline-block",width:"20%",minWidth:"20px",paddingLeft:"10px"}}>Name</span>
			<span style={{display:"inline-block",width:"40%",minWidth:"20px",paddingLeft:"10px"}}>Description</span>
			{/*<span style={{display:"inline-block",width:"9%",minWidth:"20px",paddingLeft:"10px"}}>Work order link</span>*/}
			<span style={{display:"inline-block",width:"1%",minWidth:"20px",paddingLeft:"10px"}}></span>
		</div>
        </div>
	)
}
