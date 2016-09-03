import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

MDChip = class MDChip extends React.Component {
	render() {
		return (
			<div className="md-chip" onClick={this.props.onClick}>
				<div className="left"/>
				<div className="center"/>
				<div className="right"/>
				<div className="content">
					<div className="chip-text">
						{this.props.children}
					</div>
					<div className="chip-close"/>
				</div>
			</div>
		)
	}
}