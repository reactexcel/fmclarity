import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

AutoInput.textarea = React.createClass({

	componentDidMount() {
		$(this.refs.input).elastic();
	},

	handleChange(event) {
		this.props.onChange(event.target.value);
	},

	render() {
		var value = this.props.value;
		var used = value&&value.length;
		var options = this.props.options;
		var containerStyle = _.extend({
			margin:"0 -14px"
		},options?options.containerStyle:{});
		return (
			<div className="dl-textarea md-h4-container" style={containerStyle}>
	           	<h4 className="background"><span>{this.props.placeholder}</span></h4>
	          	<textarea 
	          		ref="input"
	          		style={{margin:"0 17px",width:"97%"}}
	          		className={"input inline-form-control "+(used?'used':'')}
	          		defaultValue={value} 
	          		onChange={this.handleChange}>
	          	</textarea>
	        </div>
		)
	}
});
