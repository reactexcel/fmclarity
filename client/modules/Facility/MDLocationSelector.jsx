import React from 'react';
import ReactDOM from 'react-dom';
import {ReactMeteorData} from 'meteor/react-meteor-data';

MDLocationSelector = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		var request,location,areas,subareas,identifiers;
		var request = this.props.context;
		if(request&&request.facility) {
			areas = request.facility.areas;
		}

		location = this.props.value||{};
		if(location.area) {
			subareas = location.area.children;
		}
		if(location.subarea) {
			identifiers = location.subarea.children||location.subarea.identifiers;
		}

		return {
			location:location,
			areas:areas,
			subareas:subareas,
			identifiers:identifiers
		}
	},

	//when props change should check if facility has changed and, if so, invalidate current selection

	handleChange(attribute,newVal) {
		var location = this.props.value||{};
		location[attribute] = newVal;
		switch(attribute) {
			case "area":
				location.subarea = null;
			case "subarea":
				location.identifier = null;
			break;
		}
		this.props.onChange(location);
	},

	render() {
		//console.log(this.data);
		return (
			<div className="row">
				<div className="col-md-4">
					<AutoInput.MDSelect 
						items={this.data.areas} 
						disabled={!this.data.areas}
						selectedItem={this.data.location.area}
						itemView={NameCard}
						onChange={this.handleChange.bind(this,"area")}
						placeholder="Area"
					/>
				</div>
				<div className="col-md-4">
					<AutoInput.MDSelect 
						items={this.data.subareas} 
						disabled={!this.data.subareas}
						selectedItem={this.data.location.subarea}
						itemView={NameCard}
						onChange={this.handleChange.bind(this,"subarea")}
						placeholder="Sub-area"
					/>
				</div>
				<div className="col-md-4">
					<AutoInput.MDSelect 
						items={this.data.identifiers} 
						disabled={!this.data.identifiers}
						selectedItem={this.data.location.identifier}
						itemView={NameCard}
						onChange={this.handleChange.bind(this,"identifier")}
						placeholder="Identifier"
					/>
				</div>
			</div>
		)
	}
})