AutoInput.switch = React.createClass({

	componentDidMount() {
		var component = this;
		var save = this.props.onChange;
		var input = this.refs.input;
		new Switchery(this.refs.input, {size:'small',color:'#db4437'});
		input.onchange = function(e){
			if(component.blockNextSave) {
				component.blockNextSave = false;
				return;
			}
			var oldValue = component.props.value;
			var newValue = e.target.checked;
			if(oldValue!=newValue) {
				save(e.target.checked);
			}
		}
	},

	componentWillReceiveProps(newProps) {
		var input = this.refs.input;
		var oldValue = input.checked;
		var newValue = newProps.value;
		if(oldValue!=newValue) {
			this.blockNextSave = true;
			input.checked = newValue;
			var event = document.createEvent('HTMLEvents');
	        event.initEvent('change', true, true);
	        input.dispatchEvent(event);
		}
	},

	render() {
		var value = this.props.value;
		var label = this.props.placeholder;
		return (
	        <div className="md-switch">
				<input 
					ref="input"
					type="checkbox"
					defaultChecked={value}
				/>
				{label?
					<span className="switch-label">{label}</span>
				:
					<span className="switch-label">{this.props.children}</span>
				}
			</div>
		)
	}
});
