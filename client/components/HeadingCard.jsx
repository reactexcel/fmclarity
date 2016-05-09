import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

HeadingCard = React.createClass({
	render() {
		var item = this.props.item;
		return (
			<h4 style={{margin:0}}>{item.service.name}</h4>
		)
	}
});