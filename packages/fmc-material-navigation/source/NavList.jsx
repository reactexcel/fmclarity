import React from 'react';

export default class NavList extends React.Component
{

	componentDidUpdate()
	{
		$( this.refs.slimscroll ).slimScroll(
		{
			height: 'auto'
		} );
	}

	render()
	{
		var items = this.props.items;
		var ListTile = this.props.tile;
		var selectedItem = this.props.selectedItem ||
		{};
		return (
			<div ref="slimscroll" className={"nav-list"+(!selectedItem._id?" inactive":"")}>
				{items?items.map((item,idx)=>{
					return <div 
						key={item._id} 
						className={"list-tile"+(item._id==selectedItem._id?" active":"")} 
						onClick={()=>{this.props.onClick(item)}}
					>
						<ListTile item={item}/>
					</div>
				}):null}
			</div>
		)
	}
}