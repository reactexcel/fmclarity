import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

PlainCard = React.createClass(
{
	render()
	{
		let item = this.props.item,
			val = "";
		if ( _.isString( item ) )
		{
			val = item;
		}
		else if ( _.isObject( item ) )
		{
			if ( item.name != null )
			{
				val = item.name;
			}
		}
		return (
			<span>{val}</span>
		)
	}
} )

AutoInput.MDSelect = React.createClass(
{

	getInitialState()
	{
		let options = this.props.options ||
			{},
			open = false,
			items = this.props.items || options.items || [],
			selectedItem = this.props.value || this.props.selectedItem,
			disabled = this.props.disabled || !items || !items.length,
			errors = this.props.errors,
			readOnly = this.props.readOnly || disabled;

		if ( items != null && items.length )
		{
			let firstItem = items[ 0 ];
			if( _.isString( firstItem ) )
			{
				items = items.sort();				
			}
			else if( firstItem.name != null )
			{
				items = items.sort( ( a, b ) => { return a.name > b.name ? 1 : -1 } )
			}
		}

		return {
			open,
			items,
			selectedItem,
			disabled,
			errors,
			readOnly
		};
	},

	componentWillReceiveProps( props )
	{
		let options = props.options ||
			{},
			items = props.items || options.items || [],
			selectedItem = props.value || props.selectedItem,
			disabled = props.disabled || !items || !items.length,
			errors = props.errors,
			readOnly = props.readOnly || disabled;

		if ( items != null && items.length )
		{
			let firstItem = items[ 0 ];
			if( _.isString( firstItem ) )
			{
				items = items.sort();				
			}
			else if( firstItem.name != null )
			{
				items = items.sort( ( a, b ) => { return a.name > b.name ? 1 : -1 } )
			}
		}

		this.setState(
		{
			items,
			selectedItem,
			disabled,
			errors,
			readOnly
		} );
		this.findSelectedItem();
	},

	componentWillMount()
	{
		this.findSelectedItem();
	},

	handleChange( newItem, event )
	{
		if ( event )
		{
			event.stopPropagation();
		}
		if ( this.props.options && this.props.options.onChange )
		{
			this.props.options.onChange( newItem );
		}
		if ( this.props.onChange )
		{
			let update = {},
				fieldName = this.props.fieldName;

			update[ fieldName ] = newItem;
			this.props.onChange( update );
		}
		this.setState(
		{
			open: false,
			errors: []
		} );
	},

	clearItem()
	{
		this.handleChange( null );
	},

	inputIsUsed( selectedItem )
	{
		return _.isObject( selectedItem ) ?
			( selectedItem._id && selectedItem._id.length ) || ( selectedItem.name && selectedItem.name.length ) :
			selectedItem && selectedItem.length;
	},

	//search for the selected item in the provided list of items
	// if it is found select it
	// this if for the case where we have dependent fields
	// for example location selector dependent on facility selector value
	// we need to 
	findSelectedItem()
	{
		let
		{
			items,
			selectedItem
		} = this.state;

		if ( items != null && items.length > 0 && selectedItem != null )
		{
			let q = {},
				checkField = null,
				matchedItem = null;

			if ( selectedItem._id != null )
			{
				checkField = '_id';
			}
			else if ( selectedItem.name != null )
			{
				checkField = 'name';
				q = {
					name: selectedItem.name
				};
			}

			if ( checkField )
			{
				q[ checkField ] = selectedItem[ checkField ];
				matchedItem = _.findWhere( items, q );
				if ( matchedItem && !_.isEqual( matchedItem, selectedItem ) )
				{
					this.handleChange( matchedItem );
				}
			}
		}
	},

	render()
	{

		let options = this.props.options || {},
			{
				open,
				items,
				selectedItem,
				disabled,
				readOnly
			} = this.state,

			errors = this.state.errors,
			Card = this.props.itemView || options.view || PlainCard,
			classes = this.props.classes || options.classes || '',
			clearOption = this.props.clearOption || options.clearOption,
			used = this.inputIsUsed( selectedItem );

		//console.log( errors );

		if ( readOnly )
		{
			return (
				<div className = {"md-input md-select readonly dropdown "+classes+(disabled?" disabled":'')}>
					<span className={"input"+(used?" used":'')+(errors?" invalid":'')}>
	      				{used?<Card item={selectedItem}/>:<span>&nbsp;</span>}
	      			</span>
				    <span className="highlight"></span>
      				<span className="bar"></span>
      				<label>{this.props.placeholder}</label>
		            {
						errors?
						<div className="helper-text">{ errors[0] }</div>
						:null
					}
				</div>
			)
		}

		return ( < div className = {
				"md-input md-select dropdown" +
				( this.state.open ? " open" : "" ) +
				( classes ? ( " " + classes ) : "" )
			}
			tabIndex = "0"
			onClick = {
				() =>
				{
					if ( !this.state.open )
					{
						this.setState(
						{
							open: true
						} )
					}
				}
			}
			onFocus = {
				() =>
				{
					this.setState(
					{
						open: true
					} )
				}
			}
			onBlur = {
				() =>
				{
					this.setState(
					{
						open: false
					} )
				}
			} >

			< span className = {
				"dropdown-toggle input" +
				( used ? " used" : '' ) +
				( this.state.open ? " focus" : '' ) +
				( errors ? " invalid" : "" )
			} >
			{
				used ? <Card item = { selectedItem }/> : <span>&nbsp;</span>
			} < /span>
			{
				used ? <div className = "close-button" onClick={this.clearItem}>&times;</div> : null
			}
			<span className = "highlight"></span> < span className = "bar" > < /span> < label >
			{
				this.props.placeholder
			} < /label>

			{
				errors ?
					<div className="helper-text">{ errors[0] }</div> : null
			}

			<ul className = "dropdown-menu">
                    	{
                    	this.props.description?
                    	<li><div className="helper-text">{this.props.description}</div></li>
                    	:null
                    	}

	                    {
	                    	items.map( ( item, idx ) => {
								return (
		                        	<li 
		                        		key = { idx+'-'+(item._id || item.name) } 
		                        		className = "dropdown-menu-item" 
		                        		onClick = { (event) => 
		                        		{
		                        			this.handleChange( item, event )
		                        		}}>

		                        		<Card item = { item } />

		                        	</li>
								)                    	
	                    	})
	                    }

                    </ul>

			< /div>
		)
	}
} )
