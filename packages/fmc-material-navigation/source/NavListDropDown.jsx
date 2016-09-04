import React from 'react';

import NavListTileMultiple from './NavListTileMultiple.jsx';

export default class NavListDropDown extends React.Component
{

	constructor( props )
	{
		super( props );
		this.state = {
			selectedItem: this.props.selectedItem,
			open: this.props.startOpen != null ? this.props.startOpen : true
		};
	}

	render()
	{
		var items = this.props.items;
		var ListTile = this.props.tile;
		if ( this.state.open )
		{
			return (
				<div className="nav-list">

				{
					this.props.multiple&&items&&items.length>1?

					<div className="list-tile" onClick={()=>{
						this.setState({
							open:false,
							selectedItem:0
						});
						this.props.onChange(0);
					}}>
						<NavListTileMultiple items={items}/>
					</div>

					:null
				}

				{
					items && items.length ? items.map( ( item, idx ) =>
					{
						return (
						<div 
							key = {
								idx + '-' + item._id
							}
							className = {
								"list-tile fadeIn" + ( this.state.selectedItem && this.state.selectedItem._id == item._id ? " active" : "" )
							}
							onClick = { ( e ) =>
							{
								this.setState(
								{
									open: false,
									selectedItem: item
								} );
								this.props.onChange( item );
							}}>

							<ListTile item={item}/> 

						</div>)
					})
					:null
				}

				</div>
			)
		}
		else
		{
			return (
				<div className="nav-list-selected">
					<div className="list-tile" 
						onClick={()=>{
						this.setState({open:true});
						}}>

						{
						!this.state.selectedItem?
						<NavListTileMultiple items={items}/>
						:
						<ListTile item={this.state.selectedItem}/>
						}

					</div>
				</div>
			)
		}
	}
}