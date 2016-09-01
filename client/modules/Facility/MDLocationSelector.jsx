import React from 'react';
import ReactDOM from 'react-dom';
import {ReactMeteorData} from 'meteor/react-meteor-data';

MDLocationSelector = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		let request = this.props.context,
			areas = null,
			subareas = null,
			identifiers = null,
			level = null,
			area = null,
			identifier = null;

		if( request )
		{
			
			if( request.facility && request.facility._id ) 
			{
				facility = Facilities.findOne( request.facility._id );
				areas = facility.areas;

				if( request.level ) 
				{
					level = request.level;
					subareas = request.level.children;

					if( request.area ) 
					{
						area = request.area;
						identifier = area.identifier;
						identifiers = request.area.children || request.area.identifiers;
					}
				}
			}
		}

		return { areas, subareas, identifiers, level, area, identifier }
	},

	render() {
		console.log( this.data );
		return (
			<div className = "row">
				<div className = "col-md-4">
					<AutoInput.MDSelect 
						items = { this.data.areas } 
						disabled = { !this.data.areas }
						selectedItem = { this.data.level }
						itemView = { NameCard }
						onChange = { ( level ) => { this.props.onChange({
							level,
							area: null
						})}}
						placeholder = "Area"
					/>
				</div>
				<div className = "col-md-4">
					<AutoInput.MDSelect 
						items = { this.data.subareas } 
						disabled = { !this.data.subareas }
						selectedItem = { this.data.area }
						itemView = { NameCard }
						onChange = { ( area ) => { this.props.onChange( { area } ) } }
						placeholder="Sub-area"
					/>
				</div>
				<div className = "col-md-4">
					<AutoInput.MDSelect 
						items = { this.data.identifiers } 
						disabled = { !this.data.identifiers }
						selectedItem = { this.data.identifier }
						itemView = { NameCard }
						onChange = { ( val ) => { 
							let area = this.data.area;
							area.identifier = val;
							this.props.onChange({ area }
						)}}
						placeholder = "Identifier"
					/>
				</div>
			</div>
		)
	}
})