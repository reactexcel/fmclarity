import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

BlankLayout = React.createClass({
	componentDidMount() {
	    //$('body').addClass('gradient-bg');
	    //$('body').prepend('<div id="pattern-bg" class="pattern-bg"/>');
	},
	componentWillUnmount() {
	    //$('body').removeClass('md-skin');
	    //$('body').removeClass('gradient-bg');
	    //$('#pattern-bg').remove();
	},
	render() {return (
		<main>{this.props.content}</main>
	)}
});
