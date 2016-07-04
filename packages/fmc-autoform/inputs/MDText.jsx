import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

AutoInput.mdtext = React.createClass({

	handleSelect(event) {
		if(this.props.onSelect) {
			this.props.onSelect(event.target.value);
		}
	},

	handleChange(event) {
		if(this.props.onChange) {
			this.props.onChange(event.target.value);
		}
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

	handleClearItem() {
		if(this.props.onClear) {
			this.props.onClear()
		}
		this.handleChange({target:{value:""}});
	},

	render() {
		var value, used;
		value = this.props.value||"";
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
      			onSelect={this.handleSelect}
      			onChange={this.handleChange}
      		/>
	        {used&&value.length?<div className="close-button" onClick={this.handleClearItem}>&times;</div>:null}
      		<span className="highlight"></span>
      		<span className="bar"></span>
      		<label>{this.props.placeholder}</label>
    	</div>
    	)
	}
});
