AutoInput.attachments = React.createClass({

	handleChange(index,newValue) {
		var attachments = this.props.value;
		attachments[index] = newValue;
		this.props.onChange(attachments)
	},

	render(){
		var attachments = this.props.value;
		var component = this;
		return (
  			<div>
			{attachments.map(function(file,idx){
				return (
					<div key={idx} style={{padding:0,width:"180px",display:"inline-block"}}>
						<AutoInput.File 
							item={file}
							onChange={component.handleChange.bind(null,idx)}
						/>
					</div>
				)
			})}
			
				<div style={{padding:0,width:"180px",display:"inline-block"}}>
					<AutoInput.File onChange={component.handleChange.bind(null,attachments.length)}/>
				</div>
			
			</div>
		)
	}
})