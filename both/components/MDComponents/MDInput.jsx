MDInput = React.createClass({

	render() {
		var value = this.props.value;
		var used = value&&value.length;
		return (
			<div className="md-input">      
      			<input type="text" pattern=".{1,80}" className={used?'used':''} defaultValue={this.props.value} required/>
      			<span className="highlight"></span>
      			<span className="bar"></span>
      			<label>{this.props.label}</label>
    		</div>
		)
	}
})