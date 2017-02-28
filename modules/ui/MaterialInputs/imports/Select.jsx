/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';


/**
 * @class 			PlainCard
 * @memberOf 		module:ui/MaterialInputs
 */
const PlainCard = React.createClass( {
	render() {
		let item = this.props.item,
			val = "";
		if ( _.isString( item ) ) {
			val = item;
		} else if ( _.isObject( item ) ) {
			if ( item.name != null ) {
				val = item.name;
			}
		}
		return (
			<span>{val}</span>
		)
	}
} )

/**
 * @class 			Select
 * @memberOf 		module:ui/MaterialInputs
 */
const Select = React.createClass( {

	getInitialState() {
		return {
			open: false,
			searchedValue:''
	  	}
	},

	componentDidUpdate(){
		if(this.state.open == true){
			if(this.state.keyPress != true){
				$( ".searchInput" ).focus();
			}
			//if(this.state.keyPress == true){
				//$( ".searchInput" ).blur();
				//let id = $('a.dropdown-menu-item').eq(0)[0].id
				//console.log(id)
				//$('li#'+id).eq(0).addClass('onFocus')
				//$('a#'+id).focus()
			//}
		}
	},

	componentDidMount(){
	},

	handleChange( newItem ) {
		if ( this.props.onChange ) {
			let val = newItem;
			if( newItem && newItem.val) {
				val = newItem.val;
			}
			this.props.onChange( val );
		}
		this.setOpen( false );
		this.refs.input.blur();
	},

	clearItem( event ) {
		this.refs.input.blur();
		event.stopPropagation ();
		if ( this.props.onChange ) {
			this.props.onChange( null );
		}
	},

	inputIsUsed( selectedItem ) {
		if ( _.isObject( selectedItem ) ) {
			return (
				( selectedItem._id != null && selectedItem._id.length > 0 ) ||
				( selectedItem.name != null && selectedItem.name.length > 0 )
			)
		} else if ( _.isString( selectedItem ) ) {
			return selectedItem != null && selectedItem.length > 0;
		}
	},

	setOpen( val ) {
		this.setState( {
			open: val,
		 } );
	},



	render() {
		let {
			value,
			errors,
			placeholder,
			description,
			items,
			view = PlainCard, //should perhaps be called Tile in the original schema context
			clearOption,
			addNew = false, //should be false initialy
		} = this.props;

		let ListTile = view,
			invalid = false,
			disabled = this.props.disabled,
			readOnly = this.props.readOnly,
			hidden = false,
			used = this.inputIsUsed( value );

		if ( items == null || items.length == 0 ) {
			if ( !addNew ) {
				disabled = true;
				readOnly = true;
				hidden = true;
			}
			items = [];
		}
		if(this.state.searchedValue != '' && this.state.searchedValue != "null"){
			let value = this.state.searchedValue
			let searchedValue = []
			_.forEach(items, function(itm, i) {
				if(_.isObject(itm)){
					if((itm.name.toLowerCase().indexOf(value.toLowerCase()) != -1)){
						searchedValue.push(itm)
					}
				}else{
					if((itm.toLowerCase().indexOf(value.toLowerCase()) != -1)){
						searchedValue.push(itm)
					}
				}
			})
			items = searchedValue
		}

		if ( errors != null && errors.length > 0 ) {
			invalid = true;
		}

		let classes = [ 'input' ];
		if ( invalid ) {
			classes.push( 'invalid' );
		}
		if ( used ) {
			classes.push( 'used' );
		}
		if ( this.state.open ) {
			classes.push( 'open' );
		}

		if ( readOnly ) {
			return (
				<div className = {"md-input md-select readonly disabled dropdown"+(hidden?" hidden":"")}>

					<span className = { classes.join(' ') }>
						{ used?
						<ListTile item = { value }/>
						:<span>&nbsp;</span> }
					</span>

				    <span className = "highlight"></span>

					<span className = "bar"></span>

					<label>{ placeholder }</label>

			        {errors?
					<div className = "helper-text">{ errors[0] }</div>
					:null}

				</div>
			)
		}

		return (
			<div
				id = "mainDiv"
				ref = "input"
				className = {"md-input md-select dropdown selectHeight" +( this.state.open ? " open" : "" )}
				tabIndex = "0"
				onFocus = { () => {
					this.setOpen( true );
				} }
				onKeyDown={(e)=>{
					if(e.keyCode==9){
						this.setOpen( false )
					}
				}}>

				<span className = { "dropdown-toggle "+classes.join(' ') }>

				{used?
				<ListTile item = { value }/>
				:<span>&nbsp;</span>}

				</span>

				{used?
				<div className = "close-button" onClick = { this.clearItem }>&times;</div>
				:null}

				<span className = "highlight"></span>
				<span className = "bar" > </span>

				<label>{ placeholder }</label>

				{errors?
				<div className = "helper-text">{ errors[0] }</div>
				:null}
				<ul className = "dropdown-menu">

		        	{description?
					<div>
		        	    <li><div className = "helper-text">{ description }</div></li>
					</div>
		        	:null}
					<li>
						<div className = "helper-text">
							<input
								onBlur={(e)=>{
									this.setState({
										open:false
									})
								}}
								onKeyDown={(e)=>{

								}}
								onChange={ (e) => {
									this.setState({
										searchedValue:e.target.value
									})
                        		} }
								className="searchInput"
								ref="search"
								id="searchInput"
								placeholder="Search"
							/>
						</div>
					</li>


		        	{items.map( ( item, idx ) => {
		        	/********************************************/
		        	if( !item ) {
		        		return null;
		        	}
					let tab = idx + 1;
		        	return (
			    	<li  key = { idx+'-'+(item._id || item.name) }
						id={idx+'-'+(item._id || item.name)}
			    		className = "dropdown-menu-item"
			    		onClick = { () => {
							this.handleChange( item )
						} }>
			    		<ListTile item = { item } />

			    	</li>
				     )
		        	/********************************************/
			        })}
							{ addNew && addNew.show? <li className = "dropdown-menu-item">
								<div
									className	= "contact-list-item"
									onClick		= { () => {
										if ( addNew.onAddNewItem ) {
											addNew.onAddNewItem( this.handleChange );
										}
									} }
									style = { { paddingLeft:"24px" } }
								>

										<span style = { {display:"inline-block",minWidth:"18px",paddingRight:"24px"} }>
											<i className="fa fa-plus"></i>
										</span>

										<span className="active-link" style={{fontStyle:"italic"}}>
										 	{addNew.label}
										</span>

									</div>
								</li> : null}
	            </ul>

			</div>
		)
	}
} )

export default Select;
