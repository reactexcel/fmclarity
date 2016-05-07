PlainCard = React.createClass({
	render() {
		return (
			<span>{this.props.item}</span>
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
		this.props.onChange(item);
	},

	clearItem() {
		this.handleChange(null);
	},

	render() {
		var component = this;
		var options = this.props.options||{};

		var readOnly = this.props.readOnly;

		var Card = this.props.itemView||options.view||PlainCard;
		var items = this.props.items||options.items||[];
		var onChange = this.props.onChange;
		var classes = this.props.classes||options.classes||'';
		var clearOption = this.props.clearOption||options.clearOption;
		var selectedItem = this.props.value||this.props.selectedItem;

		if(readOnly) {
			return (
				<span className={"md-input readonly dropdown "+classes}>
					<div className={"input"+(selectedItem?" used":null)}>
	      				{selectedItem?<Card item={selectedItem}/>:null}
	      			</div>
				    <span className="highlight"></span>
      				<span className="bar"></span>
      				<label>{this.props.placeholder}</label>
				</span>
			)
		}

		return (
                <div 
                	className={(this.state.open?"open ":"")+"md-input dropdown "+classes}
                >
                	<span 
                		onClick={this.handleClick} 
                		className={
                			"dropdown-toggle input"+
                			(selectedItem?" used":'')+
                			(this.state.open?" focus":'')
                		}
                	>
	                	{selectedItem?<Card item={selectedItem}/>:<span>&nbsp;</span>}
	                </span>
	                <div className="close-button" onClick={this.clearItem}>&times;</div>
				    <span className="highlight"></span>
      				<span className="bar"></span>
                    <label>{this.props.placeholder}</label>
                    <ul className="dropdown-menu dropdown-messages">
                    {items.map(function(i,idx){
						return (
	                        <li key={idx} className="dropdown-menu-item" onClick={component.handleChange.bind(null,i)}>
	                        	<Card item={i} />
	                        </li>
						)                    	
                    })}
                    </ul>

                </div>
        )
	}
})
