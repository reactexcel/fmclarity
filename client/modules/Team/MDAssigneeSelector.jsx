import React from 'react';
import ReactDOM from 'react-dom';
import {ReactMeteorData} from 'meteor/react-meteor-data';

MDAssigneeSelector = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		var data = {
			request:this.props.context,
			assignee:this.props.value,
			supplier:null,
			members:null
		}
		if(data.request.supplier&&data.request.supplier._id) {
			data.supplier = Teams.findOne(data.request.supplier._id);
			data.members = data.supplier.getMembers();
		}
		return data;
	},

	render() {
		return (
			<AutoInput.MDSelect 
				items={this.data.members} 
				disabled={!this.data.members}
				selectedItem={this.data.assignee}
				itemView={ContactCard}
				onChange={this.props.onChange}
				placeholder="Assignee"
			/>
		)
	}
})