import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

export default function Chip( props ) {
	return (
		<div className="md-chip" onClick={ props.onClick }>
			<div className="left"/>
			<div className="center"/>
			<div className="right"/>
			<div className="content">
				<div className="chip-text">
					{ props.children }
				</div>
				<div className="chip-close"/>
			</div>
		</div>
	)
}