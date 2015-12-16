DumbCard = React.createClass({
	render() {
		return (
			<span><i className={"fa fa-circle priority-"+(this.props.item)}></i> <span style={{fontWeight:"bold",fontSize:"10px"}}>{this.props.item}</span></span>
		)
	}
})

SuperSelect = React.createClass({

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
		event.stopPropagation();
		this.props.onChange(item);
	},

	render() {
		var component = this;
		var Card = this.props.itemView || DumbCard;
		var items = this.props.items || [];
		var onChange = this.props.onChange;
		var classes = this.props.classes || '';
		var clearOption = this.props.clearOption;

		return (
                <span 
                	className={(this.state.open?"open ":"")+"super-select dropdown "+classes}
                >
                    <span onClick={component.handleClick} className="dropdown-toggle">
                    	{this.props.children}
                    </span>
                    <ul className="dropdown-menu dropdown-messages">
                    {clearOption?
                    	<li className="dropdown-menu-item" onClick={component.handleChange.bind(null,null)}>
                        	<Card item={clearOption} />
                    	</li>
	                :null}

                    {items.map(function(i,idx){
						return (
	                        <li key={idx} className="dropdown-menu-item" onClick={component.handleChange.bind(null,i)}>
	                        	<Card item={i} />
	                        </li>
						)                    	
                    })}
                    {/*<li className="browse-button">Browse</li>*/}
                    </ul>

                </span>
            )}
})
