MDInput = React.createClass({

	getInitialState() {
		var initialValue = this.props.value;
		return {
			value:initialValue,
			used:initialValue&&initialValue.length
		}
	},

	onChange(e) {
		var value = e.target.value;
		console.log(value);
		this.setState({
			value:value,
			used:value&&value.length
		})
	},

	render() {
		var used = this.state.used;
		var value = this.state.value;
		return (
			<div className="md-input">      
      			<input type="text" pattern=".{1,80}" className={used?'used':''} value={value} onChange={this.onChange} required/>
      			<span className="highlight"></span>
      			<span className="bar"></span>
      			<label>{this.props.label}</label>
    		</div>
		)
	}
})