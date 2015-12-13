AutoInput.attachments = React.createClass({

	onChange(index,event) {
		console.log({
			event:event,
			index:index
		});
		var attachments = this.props.value;
		attachments[index] = event.target.value;
		this.props.onChange({
			target:{
				value:attachments
			}
		})
	},

	render(){
		var attachments = this.props.value;
		console.log(attachments);
		var component = this;
		var File = AutoInput.file;
		return (
  			<div>
			{attachments.map(function(file,idx){
				return (
					<div key={idx} style={{padding:0,width:"180px",display:"inline-block"}}>
						<File 
							item={file}
							onChange={component.onChange.bind(null,idx)}
						/>
					</div>
				)
			})}
			
				<div style={{padding:0,width:"180px",display:"inline-block"}}>
					<File onChange={component.onChange.bind(null,attachments.length)}/>
				</div>
			
			</div>
		)
	}
})