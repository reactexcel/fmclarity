import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

PrintLayout = React.createClass({
	render() {return (
		<main className="print">{this.props.content}<img className="logo" src="/img/logo-horizontal-blue.svg" style={{position:"fixed",right:"50px",top:"40px",width:"150px",opacity:"0.5"}}/></main>
	)}
});
