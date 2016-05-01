AutoInput.date = React.createClass({

	handleChange(event) {
		var date,value;
		value = event.target.value;
		if(value) {
			date = new Date(value);
		}
		this.props.onChange(date);
	},

	dateToString(value) {
		if(!value) 
			return;
		var year = value.getFullYear();
		var month = value.getMonth().toString().length === 1 ? '0' + (value.getMonth() + 1).toString() : value.getMonth() + 1;
		var date = value.getDate().toString().length === 1 ? '0' + (value.getDate()).toString() : value.getDate();
		var hours = value.getHours().toString().length === 1 ? '0' + value.getHours().toString() : value.getHours();
		var minutes = value.getMinutes().toString().length === 1 ? '0' + value.getMinutes().toString() : value.getMinutes();
		var seconds = value.getSeconds().toString().length === 1 ? '0' + value.getSeconds().toString() : value.getSeconds();
		return year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds;
	},

	render() {
		var value = this.props.value;
		var convertedValue = this.dateToString(this.props.value);
		return (
			<div>
			{
				this.props.placeholder?
					<span style={{color:"#999"}}>{this.props.placeholder}:&nbsp;&nbsp;</span>
				:null
			}
			<input 
				style={{border:"none",outline:"none",backgroundColor:"transparent"}}
				type="datetime-local"
				ref="input"
				value={convertedValue} 
				readOnly={this.props.readOnly}
				onChange={this.handleChange}
			/>
			</div>
		)
	}
});
