import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';


DocumentIconHeader = React.createClass( {

	render() {
		return (
			<div style={{padding:"14px 24px 14px 24px",borderBottom:"1px solid #ddd",backgroundColor:"#eee",fontWeight:"bold"}} onClick={this.handleClick}>
				<span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}>&nbsp;</span>
				<span style={{display:"inline-block",width:"20%",minWidth:"20px"}}>Type</span>
				<span style={{display:"inline-block",width:"20%",minWidth:"20px",paddingLeft:"10px"}}>Name</span>
				<span style={{display:"inline-block",width:"50%",minWidth:"20px",paddingLeft:"10px"}}>Description</span>
			</div>
		)
	}
} );
