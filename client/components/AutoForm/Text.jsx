AutoInput.Text = React.createClass({
	mixins:[AutoInput.Events],

	propTypes:{
		onChange:React.PropTypes.func.isRequired
	},

	componentDidMount() {
		var input = $(this.refs.input);
		if(this.props.elastic) {
			input.elastic();
		}
		if(this.props.autoFocus) {
			input.focus();
		}
	},

	componentDidUpdate() {
		var input = $(this.refs.input);
		if(this.props.autoFocus) {
			input.focus();
		}
	},

	render() {
		if(this.props.readOnly) {
			return <span style={{whiteSpace:"pre-wrap"}}>{this.props.value}{this.props.elastic?<br/>:''}</span>
		}
		if(this.props.elastic) {
			return (
                <textarea 
                	ref="input"
                	readOnly={this.props.readOnly}
					placeholder={this.props.placeholder}
                    className="issue-description-textarea inline-form-control" 
					value={this.props.value}
					onChange={this.handleChange}
					onKeyDown={this.checkKey}
                />
			)
		}
		return (
		<input 
           	ref="input"
			type="text"
           	readOnly={this.props.readOnly}
			placeholder={this.props.placeholder}
			className="inline-form-control" 
			value={this.props.value} 
			onChange={this.handleChange}
			onKeyDown={this.checkKey}
		/>
		)
	}
});
