import React from 'react';
import ReactDOM from 'react-dom';
import { ReactMeteorData } from 'meteor/react-meteor-data';

MDFacilitySelector = React.createClass(
{

	mixins: [ ReactMeteorData ],

	getMeteorData()
	{
		return {
			facilities: Meteor.user().getFacilities(),
		}
	},

	render()
	{
		let { onChange, ...other } = this.props;
		return ( <AutoInput.MDSelect {...other}
			items = {
				this.data.facilities
			}
			itemView = {
				FacilitySummary
			}
			onChange = {
				( val ) =>
				{
					console.log( val );
					onChange(
					{
						facility: val,
						location: null,
						level: null,
						area: null,
						supplier: null,
						assignee: null
					} );
				}
			}
			/>
		)
	}
} )
