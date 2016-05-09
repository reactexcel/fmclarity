import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

AutoInput.mdtext = React.createClass({

	handleChange(event) {
		this.props.onChange(event.target.value);
	},

	componentDidMount() {
		var input = $(this.refs.input);
		if(this.props.autoFocus) {
			input.focus();
		}
		else if(this.props.autoSelect) {
			input.select();
		}
	},

	componentDidUpdate() {
		var input = $(this.refs.input);
		if(this.props.autoFocus) {
			input.focus();
		}
		else if(this.props.autoSelect) {
			input.select();
		}
	},

	render() {
		var value, used;
		value = this.props.value;
		used = value!=null;
		if(_.isString(value)) {
			used = used&&value.length;
		}
		return (
		<div className="md-input">      
      		<input 
      			ref="input"
      			type="text" 
      			pattern=".{1,80}" 
      			className={"input "+(used?'used':'')} 
      			value={value}
      			onChange={this.handleChange}
      		/>
      		<span className="highlight"></span>
      		<span className="bar"></span>
      		<label>{this.props.placeholder}</label>
    	</div>
    	)
	}
});
