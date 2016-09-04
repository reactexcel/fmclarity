import React from 'react';

FacilityThumbnail = React.createClass(
{
	mixins: [ ReactMeteorData ],
	getMeteorData()
	{
		return {
			thumb: this.props.item.getThumbUrl()
		}
	},
	render()
	{
		var style = _.extend(
		{
			//width:"37px",
			//height:"37px",
			backgroundImage: "url('" + this.data.thumb + "')",
			backgroundSize: "cover"
		}, this.props.style )
		return <div className="facility-thumbnail" style={style}>
			{this.props.children}
		</div>
	}
} )