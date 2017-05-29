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
			open: false
	  	}
	},

	componentDidUpdate(){
		if(this.state.open == true){
			$( ".searchInput" ).focus();
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

	sortString(ary, fullNumbers) {
	  	var re = fullNumbers ? /[\d\.\-]+|\D+/g : /\d+|\D+/g;
	  	for (var i=ary.length;i--;)
	    	ary[i] = [ary[i]].concat((ary[i]+"").match(re).map(function(s){
	      		return isNaN(s) ? [s,false,s] : [s*1,true,s];
	    	}));
	  	ary.sort(function(a,b){
	    	var al = a.length, bl=b.length, e=al>bl?al:bl;
	    	for (var i=1;i<e;++i) {
	      		if (i>=al) return -1; else if (i>=bl) return 1;
	      		else if (a[i][0]!==b[i][0])
	        	return (a[i][1]&&b[i][1]) ?
	               (a[i][0]-b[i][0]) :
	               (a[i][2]<b[i][2]) ? -1 : 1;
	    	}
	    	return 0;
	  	});
	  	for (var i=ary.length;i--;) ary[i] = ary[i][0];
	  	return ary;
  	},

 	sortObject(arr) {
 		let sortedList = arr.sort(function(a, b){
			if(a != null && a.name != null && b != null && b.name != null){
	 			var textA = a.name.toUpperCase();
    			var textB = b.name.toUpperCase();
    			return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			} else {
				return 0;
			}
		});
 		return sortedList
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
			hidden = false,
			disabled = this.props.disabled,
			readOnly = this.props.readOnly,
			used = this.inputIsUsed( value );

		if ( items == null || items.length == 0 ) {
			if ( !addNew ) {
				hidden = true;
				disabled = true;
				readOnly = true;
			}
			items = [];
		}
		let sortedItems = []
		if(typeof items[0] == 'string'){
			sortedItems = this.sortString(items)
		} else if(typeof items[0] == 'object') {
			sortedItems = this.sortObject(items)
		} else {
			sortedItems = items
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
				<div className = {"md-input md-select readonly disabled dropdown"+(hidden?' hidden':'')}>

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
				onBlur={(e)=>{
					let $selected = $('ul#open > li').filter('.onFocus')
					this.setOpen( false );
				}}
				onKeyDown={(e)=>{
					let list = document.getElementById('open')
					let targetList = $('ul#open > li.onFocus').position()
					if(targetList != undefined){
						list.scrollTop = (targetList.top - $('ul#open > li:first').position().top);
					}
					let key = e.keyCode
					let $selected = $('ul#open > li').filter('.onFocus')
					if(key == 13){
						if($selected.length){
							$selected.click();
						}
					}
					if(key == 40){
						e.preventDefault();
						if(!$selected.length){
							$('ul#open > li').eq(0).addClass('onFocus')
						}
						else if( $selected.is(':last-child') ){
							return;
						}else{
							if($($selected.next()[0]).is("li")){
								$('ul#open > li').removeClass('onFocus')
								$selected.next().addClass('onFocus')
							}
						}
					}
					if(key == 38){
						e.preventDefault();
						if(!$selected.length){
							return;
						}
						else if( $selected.is(':last-child') ){
							$('ul#open > li').removeClass('onFocus')
							$selected.prev().addClass('onFocus')
						}else{
							if($($selected.prev()[0]).is("li")){
								$('ul#open > li').removeClass('onFocus')
								$selected.prev().addClass('onFocus')
							}
						}
					}
					if(key==9){
						$selected.click();
					}
					this.setOpen( false )
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
				<ul id={this.state.open == true ? "open":"closed"} className = "dropdown-menu">

		        	{description?
					<div>
		        	    <li><div className = "helper-text">{ description }</div></li>
					</div>
		        	:null}

		        	{sortedItems.map( ( item, idx ) => {
		        	/********************************************/
		        	if( !item ) {
		        		return null;
		        	}
					var isFoucs = ''
					if(item === value){
						isFoucs = ' onFocus'
					}
		        	return (
			    	<li key = { idx+'-'+(item._id || item.name) }
						id={idx+'-'+(item._id || item.name)}
			    		className = {"dropdown-menu-item"+isFoucs}
			    		onClick = { () => {
							this.handleChange( item )
						} }
						onKeyDown={(e)=>{

						}}>

			    		<ListTile item = { item } />

			    	</li>
				     )
		        	/********************************************/
			        })}
							{ addNew && addNew.show? <div>
								<li className = "dropdown-menu-item">
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
									</li>
									</div>
								 : null}
	            </ul>

			</div>
		)
	}
} )

export default Select;
