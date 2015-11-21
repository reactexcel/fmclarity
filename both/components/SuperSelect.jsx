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

	handleClick() {
		this.setState({
			open:!this.state.open
		})
	},

	componentDidMount() {
		var toggleId = this.props.toggleId;
		if(toggleId) {
			$(document).on('click',toggleId,this.handleClick);
		}
	},

	componentWillUnmount () {
		var toggleId = this.props.toggleId;
		if(toggleId) {
			$(document).off('click',toggleId,this.handleClick);
		}
	},

	render() {
		var Card = this.props.itemView || DumbCard;
		var items = this.props.items || [];
		var handleClick = this.props.onChange;
		var classes = this.props.classes || '';

		return (
                <span 
                	onClick={this.handleClick}
                	className={(this.state.open?"open ":"")+"super-select dropdown "+classes}
                >
                    <span className="dropdown-toggle">
                    	{this.props.children}
                    </span>
                    <ul className="dropdown-menu dropdown-messages">
                    {items.map(function(i,idx){
						return (
	                    	<span key={idx}>
	                        <li onClick={handleClick.bind(null,i)}>
	                        	<Card item={i} />
	                        </li>
	                        <li className="divider"></li>
	                        </span>
						)                    	
                    })}
                    {/*<li className="browse-button">Browse</li>*/}
                    </ul>

                </span>
            )}
})
