import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

AutoInput.rating = React.createClass({
	render() {
		return (
			<div className="autoinput-rating">
				<span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
			</div>
		)
	}
});
