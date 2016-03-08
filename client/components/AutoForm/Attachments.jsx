AutoInput.attachments = React.createClass({

	handleChange(index,newValue) {
		var attachments = this.props.value;
		if(newValue) {
			attachments[index] = newValue;
		}
		else {
			attachments.splice(index,1);
		}
		this.props.onChange(attachments)
	},

	render(){
		var attachments = this.props.value;
		var component = this;
		return (
  			<div>
			{attachments.map(function(file,idx){
				return (
					<div key={idx} style={{display:"inline-block"}}>
						<AutoInput.Thumbnail 
							item={file}
							onChange={component.handleChange.bind(null,idx)}
						/>
					</div>
				)
			})}
			
				<div style={{display:"inline-block"}}>
					<AutoInput.Thumbnail 
						onChange={component.handleChange.bind(null,attachments.length)}
					/>
				</div>
			
			</div>
		)
	}
})