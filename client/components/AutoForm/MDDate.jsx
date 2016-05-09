import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'material-ui/DatePicker';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

AutoInput.MDDate = React.createClass({

	handleChange(event,date) {
		this.props.onChange(date);
	},

	render() {
		var value = this.props.value||undefined;
		return (
			<DatePicker 
				id={"date-input"} 
				className={"date-input"}
				floatingLabelText={this.props.placeholder}
				style={{fontSize:"13px"}}
				mode="landscape" 
				onChange={this.handleChange}
				defaultDate={value}
				formatDate={function(date){
					return moment(date).format('MM/DD/YYYY');
				}}
			/>
		)
	}
});
