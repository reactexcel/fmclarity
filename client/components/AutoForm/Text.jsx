AutoInput.Text = React.createClass({
	mixins:[AutoInput.Events],


	propTypes:{
		onChange:React.PropTypes.func.isRequired
	},

	componentDidMount() {
		if(this.props.elastic) {
			$(this.refs.input).elastic();		
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
		/>
		)
	}
});
