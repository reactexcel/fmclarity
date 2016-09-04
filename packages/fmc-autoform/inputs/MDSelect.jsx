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
		return { open: false }
	},

	handleChange( newItem )
	{
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
		if( _.isObject( selectedItem ) )
		{
			return (
				( selectedItem._id != null && selectedItem._id.length > 0 ) ||
				( selectedItem.name != null && selectedItem.name.length > 0 )
			)
		}
		else if( _.isString( selectedItem ) )
		{
			return selectedItem != null && selectedItem.length > 0;
		}
	},

	setOpen( val )
	{
		this.setState({ open:val });
	},

	render()
	{
		let { 
			value, 
			disabled, 
			readOnly, 
			errors, 
			placeholder, 
			description, 
			items, 
			view = PlainCard, //should perhaps be called Tile in the original schema context
			clearOption 
		} = this.props;

		let ListTile = view;

		if( items == null || items.length == 0 ) 
		{
			disabled = true;
			readOnly = true;
		}

		if( errors != null && errors.length > 0 )
		{
			invalid = true;
		}

		used = this.inputIsUsed( value );

		let classes = ['input'];
		if( invalid ) 
		{
			classes.push('invalid');
		}
		if( used )
		{
			classes.push('used');
		}
		if( this.state.open )
		{
			classes.push('open');
		}

		if ( readOnly )
		{
			return (
				<div className = {"md-input md-select readonly disabled dropdown"}>

					<span className={ classes.join(' ') }>
						{used?
						<ListTile item = { value }/>
						:<span>&nbsp;</span>}
					</span>

				    <span className="highlight"></span>

					<span className="bar"></span>

					<label>{ placeholder }</label>

			        {errors?
					<div className="helper-text">{ errors[0] }</div>
					:null}

				</div>
			)
		}

		return (
			<div className = {"md-input md-select dropdown" +( this.state.open ? " open" : "" )}
				tabIndex = "0"
				onClick = { () => { this.setOpen(true) } }
				onFocus = { () => { this.setOpen(true) } }
				onBlur = { () => { this.setOpen(false) } }>

				<span className = { "dropdown-toggle "+classes.join(' ') }>

				{used?
				<ListTile item = { value }/>
				:<span>&nbsp;</span>}

				</span>

				{used?
				<div className = "close-button" onClick={this.clearItem}>&times;</div>
				:null}

				<span className = "highlight"></span>
				<span className = "bar" > </span>

				<label>{ placeholder }</label>

				{errors?
				<div className="helper-text">{ errors[0] }</div>
				:null}

				<ul className = "dropdown-menu">

		        	{description?
		        	<li><div className="helper-text">{ description }</div></li>
		        	:null}

		        	{items.map( ( item, idx ) => { 
		        	/********************************************/
		        	return (
			    	<li key = { idx+'-'+(item._id || item.name) } 
			    		className = "dropdown-menu-item" 
			    		onClick = { () => { this.handleChange( item ) } }>

			    		<ListTile item = { item } />

			    	</li> )
		        	/********************************************/
			        })}

	            </ul>

			</div>
		)
	}
} )
