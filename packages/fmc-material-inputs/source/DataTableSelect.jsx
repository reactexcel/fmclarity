import React from "react";

export default DataTableSelect = React.createClass({

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

	render() {
		var component = this;
		var readOnly = this.props.readOnly;
		var items = this.props.items||options.items||[];

		if(readOnly) {
			return (
				<span className={"readonly dropdown "+classes}>
					<div className={"input"+(selectedItem?" used":null)}>
	      				{selectedItem?selectedItem.label:null}
	      			</div>
      				<label>{this.props.placeholder}</label>
				</span>
			)
		}

		return (
			<div className="data-table-menu">
                <div 
                	className={(this.state.open?"open ":"")+"dropdown"}
                >
                	<span 
                		onClick={this.handleClick} 
                		className={
                			"dropdown-toggle input"+
                			(this.state.open?" focus":'')
                		}
                	>
	                	{this.props.children||<span>&nbsp;</span>}
	                </span>
                    <label>{this.props.placeholder}</label>
                    <ul className="dropdown-menu dropdown-messages">
                    {items.map(function(i,idx){
						return (
	                        <li key={idx} className="dropdown-menu-item" onClick={i.action.bind(i)}>
	                        	{i.label}
	                        </li>
						)                    	
                    })}
                    </ul>

                </div>
            </div>
        )
	}
})
