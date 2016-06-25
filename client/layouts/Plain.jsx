import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

BlankLayout = React.createClass({
	render() {return (
		<main>{this.props.content}</main>
	)}
});
