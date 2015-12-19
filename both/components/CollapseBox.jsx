
CollapseBox = React.createClass({

	getInitialState() {
		return {
			collapsed:this.props.collapsed
		}
	},

	toggle() {
		this.setState({
			collapsed:!this.state.collapsed
		});
	},

	render() {
		var collapsed = this.state.collapsed;
		return (
			<div>
			    <h4 onClick={this.toggle} className="background" style={{margin:"10px 15px",cursor:"pointer"}}>
			    	<span><i className={"fa fa-caret-"+(collapsed?'right':'down')}></i> {this.props.title}</span>
			    </h4>
			    {collapsed?null:
			    <div className={"collapse-box "+(collapsed?'collapsed':'')} ref="collapser">
			    	{this.props.children}
			    </div>}
			</div>
		)
	}
});