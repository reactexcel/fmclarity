import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

RolesPageIndex = React.createClass({
	mixins:[ReactMeteorData],

	getMeteorData() {
		console.log(ORM);
		return {
			fart:"no"
		}
	},
	render() {
		return <div/>
	}
})

RolesViewEdit = React.createClass({
	render() {
		return <div/>
	}
})