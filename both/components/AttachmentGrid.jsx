AttachmentGrid = React.createClass({
	render(){
		var attachments = this.props.items;
		return (
  			<div>
			{attachments.map(function(img,idx){
				return (
					<div key={idx} style={{padding:0,width:"180px",display:"inline-block"}}>
			        	<div className="ibox" style={{margin:"5px 0 0 5px",padding:"5px"}}>
			                <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={img} />
			            </div>
					</div>
				)
			})}
			</div>
		)
	}
})