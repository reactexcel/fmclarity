import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

PlainCard = React.createClass({
	render() {
		return (
			<span>{this.props.item}</span>
		)
	}
})


NameCard = React.createClass({
	render() {
		var name;
		var item = this.props.item;
		if(item) {
			name = item.name;
		}
		return (
			<span>{name}&nbsp;</span>
		)
	}
})


AutoInput.MDSelect = React.createClass({

	getInitialState() {

		let options = this.props.options || {};

		let open = false,
			items = this.props.items || options.items || [],
			selectedItem = this.props.value || this.props.selectedItem;

		let disabled = this.props.disabled || !items || !items.length;
		let readOnly = this.props.readOnly || disabled;

		return {open,items,selectedItem,disabled,readOnly};
	},

	componentWillReceiveProps(props) {
		let options = props.options || {};		
		let items = props.items || options.items || [],
			selectedItem = props.value || props.selectedItem;

		let disabled = props.disabled || !items || !items.length;
		let readOnly = props.readOnly || disabled;
		this.setState({items,selectedItem,disabled,readOnly});
		this.findSelectedItem();
	},

	componentWillMount() {
		this.findSelectedItem();
	},

	handleClick(event) {
		var open = !this.state.open;
		if(open) {
			$(document).on('click',this.handleClick);
		}
		else {
			$(document).off('click',this.handleClick);
		}
		this.setState({
			open:open
		});
	},

	handleChange(item,event) {
		if(event) {
			event.stopPropagation();
		}
		if(this.props.options&&this.props.options.onChange) {
			this.props.options.onChange(item);
		}
		if(this.props.onChange) {
			this.props.onChange(item);
		}
	},

	clearItem() {
		this.handleChange(null);
	},

	inputIsUsed(selectedItem) {
		return _.isObject(selectedItem)?
			(selectedItem._id&&selectedItem._id.length)||(selectedItem.name&&selectedItem.name.length)
		:
			selectedItem&&selectedItem.length;
	},

	//search for the selected item in the provided list of items
	// if it is found select it
	// this if for the case where we have dependent fields
	// for example location selector dependent on facility selector value
	// we need to 
	findSelectedItem() {
		let {items,selectedItem} = this.state;
		if(items&&selectedItem) {
			let q = {},
				checkField = null,
				matchedItem = null;

			if(selectedItem._id) {
				checkField = '_id';
			}
			else if(selectedItem.name) {
				checkField =  'name';
				q = {name:selectedItem.name};
			}

			if(checkField) {
				q[checkField] = selectedItem[checkField];
				matchedItem = _.findWhere(items,q);
				if(matchedItem&&!_.isEqual(matchedItem,selectedItem)) {
					this.handleChange(matchedItem);
				}
			}
		}
	},

	render() {

		let options = this.props.options || {};

		let {open,items,selectedItem,disabled,readOnly} = this.state;

		let Card = this.props.itemView || options.view || PlainCard,
			classes = this.props.classes || options.classes || '',
			clearOption = this.props.clearOption || options.clearOption,
			used = this.inputIsUsed(selectedItem);

		if(readOnly) {
			return (
				<div className={"md-input readonly dropdown "+classes+(disabled?" disabled":'')}>
					<span className={"input"+(used?" used":'')}>
	      				{used?<Card item={selectedItem}/>:<span>&nbsp;</span>}
	      			</span>
				    <span className="highlight"></span>
      				<span className="bar"></span>
      				<label>{this.props.placeholder}</label>
				</div>
			)
		}

		return (
                <div 
                	className={(this.state.open?"open ":"")+"md-input dropdown "+classes}
                >
                	<span 
                		onClick={this.handleClick} 
                		tabIndex="0"
                		className={
                			"dropdown-toggle input"+
                			(used?" used":'')+
                			(this.state.open?" focus":'')
                		}
                	>
	                	{used?<Card item={selectedItem}/>:<span>&nbsp;</span>}
	                </span>
	                {used?<div className="close-button" onClick={this.clearItem}>&times;</div>:null}
				    <span className="highlight"></span>
      				<span className="bar"></span>
                    <label>{this.props.placeholder}</label>
                    <ul className="dropdown-menu dropdown-messages">
                    {items.map((i,idx)=>{
						return (
	                        <li key={idx} className="dropdown-menu-item" onClick={(event)=>{this.handleChange(i,event)}}>
	                        	<Card item={i} />
	                        </li>
						)                    	
                    })}
                    </ul>

                </div>
        )
	}
})
