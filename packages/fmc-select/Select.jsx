import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

DumbCard = React.createClass({
	render() {
		return (
			<span><i className={"fa fa-circle priority-"+(this.props.item)}></i> <span style={{fontWeight:"bold",fontSize:"10px"}}>{this.props.item}</span></span>
		)
	}
})

NameCard = React.createClass({
	render() {
		var contact = this.props.item || {};
		var name;
		if(_.isString(contact)) {
			name = contact;
		}
		else {
			name = contact.getName?contact.getName():contact.name;
		}

		return (
			<span>{name}</span>
		)
	}
})

SuperSelect = React.createClass({

	getInitialState() {
		return this.props.initialState||{
			open:false,
			more:false
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
		this.setState({
			open:false
		});
		event.stopPropagation();
		this.props.onChange(item);
	},

	toggleMore() {
		this.setState({
			more:!this.state.more,
			open:true,
		});
	},

	render() {
		var component = this;
		var readOnly = this.props.readOnly;
		var Card = this.props.itemView || DumbCard;
		var items = this.state.more?this.props.moreItems:(this.props.items || []);
		var onChange = this.props.onChange;
		var classes = this.props.classes || '';
		var clearOption = this.props.clearOption;

		if(readOnly) {
			return (
				<span className={"super-select readonly dropdown "+classes}>
					<span className="dropdown-toggle">
						{this.props.children}
					</span>
				</span>
			)
		}

		return (
                <div 
                	className={(this.state.open?"open ":"")+"super-select dropdown "+classes}
                >
                    <span onClick={component.handleClick} className="dropdown-toggle">
                    	{this.props.children}
                    </span>
                    <ul className="dropdown-menu dropdown-messages">
                    {clearOption?
                    	<li className="dropdown-menu-item" onClick={component.handleChange.bind(null,null)}>
                        	<i><Card item={clearOption} /></i>
                    	</li>
	                :null}

                    {(items&&items.length)?items.map(function(i,idx){
						return (
	                        <li key={idx} className="dropdown-menu-item" onClick={component.handleChange.bind(null,i)}>
	                        	<Card item={i} />
	                        </li>
						)                    	
                    }):null}
                    {this.props.moreItems?
                    	<li onClick={this.toggleMore} style={{cursor:"pointer"}} className="browse-button">{this.state.more?<span>Less</span>:<span>More</span>}</li>
                    :null}
                    </ul>

                </div>
        )
	}
})
