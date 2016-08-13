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
		return this.props.initialState||{
			open:false
		}
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

	render() {
		var component = this;
		var options = this.props.options||{};


		var Card = this.props.itemView||options.view||PlainCard;
		var onChange = this.props.onChange;
		var classes = this.props.classes||options.classes||'';
		var clearOption = this.props.clearOption||options.clearOption;

		var items = this.props.items||options.items||[];
		var selectedItem = this.props.value||this.props.selectedItem;
		
		var disabled = this.props.disabled||!items||!items.length;
		var readOnly = this.props.readOnly||disabled;

		if(items&&selectedItem) {
			var q;
			if(selectedItem._id) {
				q = {_id:selectedItem._id};
			}
			else if(selectedItem.name) {
				q = {name:selectedItem.name};
			}
			if(q) {
				var matchedItem = _.findWhere(items,q);
				if(matchedItem) {
					selectedItem = matchedItem;
				}
			}
		}

		var used = 
		_.isObject(selectedItem)?
			(selectedItem._id&&selectedItem._id.length)||(selectedItem.name&&selectedItem.name.length)
		:
			selectedItem&&selectedItem.length;

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
