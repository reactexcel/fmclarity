import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

ActionsMenu = React.createClass({

	runAction(item,event) {
		if(item.shouldConfirm) {
			var message = confirm(item.label+". Are you sure?");
			if(message != true){
				return;
     		}
		}
		item.action(event);
	},

	render() {
		var icon = this.props.icon||'wrench';
		var component = this;
		if(!(this.props.items&&this.props.items.length)) {
			return <div/>
		}
		return (
			<div>
				<a className="dropdown-toggle tools-icon" data-toggle="dropdown" href="#">
					<i className={"fa fa-"+icon}></i>
				</a>
				<ul className="dropdown-menu dropdown-user" style={{
					position:"absolute",
					right: 0,
					top: "30px",
					left: "auto"
		    	}}>
		    		{this.props.items.map(function(i,idx){
		    			return (
		    				<li key={idx} onClick={component.runAction.bind(null,i)}><a>{i.label}</a></li>
		    			)
		    		})}
				</ul>
			</div>
		)
	}

});