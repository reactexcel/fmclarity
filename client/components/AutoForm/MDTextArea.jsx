AutoInput.mdtextarea = React.createClass({

	componentDidMount() {
		var component = this;
		setTimeout(function(){
			$(component.refs.input).elastic();
		},400);
	},

	handleChange(event) {
		this.props.onChange(event.target.value);
	},

	render() {
		var value = this.props.value;
		var used = value&&value.length;
		var options = this.props.options;
		var containerStyle = _.extend(options?options.containerStyle:{});
		return (
			<div className="md-textarea" style={containerStyle}>
	           	{/*<h4 className="background"><span>{this.props.placeholder}</span></h4>*/}
	          	<textarea 
	          		ref="input"
	          		className={"input inline-form-control "+(used?'used':'')}
	          		defaultValue={value} 
	          		onChange={this.handleChange}>
	          	</textarea>
      			<span className="highlight"></span>
      			<span className="bar"></span>
	      		<label>{this.props.placeholder}</label>
	        </div>
		)
	}
});
