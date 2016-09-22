/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import NavListTileMultiple from './NavListTileMultiple.jsx';

/**
 * An ui component that displays a drop down list for the provided items, renders each item using the provided tile, and calls onChange when an item is selected.
 * Used for fm clarity filter components including module:models/Facilities.FacilityFilter and module:models/Teams.TeamFilter.
 * @memberOf		module:ui/MaterialNavigation
 * @requires 		module:ui/MaterialNavigation.NavListTileMultiple
 * @param 			{array} items - The data items that will be rendered in the dropdown list
 * @param 			{React.Component} ListTile - The ui component that will be used to render the individual list items
 * @param 			{function} onChange - Callback for when a new item is selected
 * @param 			{Document} [selectedItem] - the item from the set that is currently selected
 * @param 			{boolean} [startOpen] - If true, the drop down is initialised to be open
 * @param 			{boolean} [multiple] - If true, an additional list entry is included to select "multiple items"
 */
class NavListDropDown extends React.Component {

	constructor( props ) {
		super( props );
		this.state = {
			selectedItem: this.props.selectedItem,
			open: this.props.startOpen != null ? this.props.startOpen : true
		};
	}

	render() {
		let { items, ListTile } = this.props;
		// if the dropdown is open - render the complete list
		//  refact - perhaps the open list state could be implemented in a separate component?
		if ( this.state.open ) {
			return (
				<div className="nav-list">

				{ this.props.multiple && items.length>1 ?

					<div className="list-tile" onClick={ ()=>{
						this.setState( {
							open:false,
							selectedItem:0
						} )
						this.props.onChange(0);
					}}>
						<NavListTileMultiple items={items}/>
					</div>

				: null }

				{ items.map( ( item, idx ) => {
					return ( 
						<div 
							key 		= { `${idx}-${item._id}` }
							className 	= { "list-tile fadeIn" + ( this.state.selectedItem && this.state.selectedItem._id == item._id ? " active" : "" ) }
							onClick 	= { ( e ) => {
								this.setState( {
									open: false,
									selectedItem: item
								} );
								this.props.onChange( item );
							}
						}>
							<ListTile item={item}/>

						</div>
					)
				} ) }

				</div>
			)
		} 
		// if the dropdown is closed render the selected item - or if no item is selected the muliple selection tile
		else {
			return (
				<div className="nav-list-selected">
					<div 
						className	="list-tile" 
						onClick		= { () => {
							this.setState({open:true});
						} }
					>

					{ !this.state.selectedItem ?
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

NavListDropDown.propTypes = {
	items: React.PropTypes.array.isRequired,
	ListTile: React.PropTypes.func.isRequired,
	onChange: React.PropTypes.func.isRequired,
	selectedItem: React.PropTypes.object,
	startOpen: React.PropTypes.bool,
	multiple: React.PropTypes.bool
}

export default NavListDropDown;