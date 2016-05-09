import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

AutoInput.Select = React.createClass({

	generateUid(separator) {
	    /// <summary>
	    ///    Creates a unique id for identification purposes.
	    /// </summary>
	    /// <param name="separator" type="String" optional="true">
	    /// The optional separator for grouping the generated segmants: default "-".    
	    /// </param>

	    var delim = separator || "-";

	    function S4() {
	        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	    }

	    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
	},

	handleChange(event) {
		this.props.onChange(event.target.value);
	},

	render() {
		var options = this.props.options;
		var defaultValue = this.props.value;
		var key = this.generateUid();
		var id = "datalist-"+key;

		return (
			<div>
				{
					this.props.placeholder?
						<span style={{display:"inline-block",lineHeight:"50px",width:"150px",color:"#999"}}>{this.props.placeholder}</span>
					:
						null
				}
				<select 
					type="text"
					style={{display:"inline-block"}}
					list={id}
					onChange={this.handleChange}
					value={defaultValue} 
				>
					{options.map(function(i){
						return <option key={i} value={i}>{i}</option>
					})}
				</select>
			</div>
		)
	}

});
