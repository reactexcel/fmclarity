ContactSummary = React.createClass({

	random() {
	    var x = Math.sin(this.seed++) * 10000;
	    return x - Math.floor(x);
	},

	render() {
	    var contact = this.props.item;
	    if(contact.name) {
			this.seed = contact.name.charCodeAt(0)+contact.name.charCodeAt(1)+contact.name.charCodeAt(2);
		}
		else {
			this.seed = 1;
		}
	    var textureNum = Math.ceil(this.random()*4);
	    var borderStyle = Math.ceil(this.random()*5);
	    var colorOverlayStyle = Math.ceil(this.random()*2);
	    var colorOverlayCol = Math.ceil(this.random()*3);
	    var cardStyle = Math.ceil(this.random()*3);
		var radiusStyle = Math.ceil(this.random()*6);
	    var size=this.props.size;
	    var services = contact&&contact.services?contact.services.join(' | '):'';
	    return (
	    	<div className={"business-card"+" business-card-style-"+cardStyle+" business-card-radius-style-"+radiusStyle+" "+size}>
	    		{/*
				<div style={{marginTop:"10px",width:"25px",float:"left"}}>
					<input type="checkbox" />
				</div>*/}
				<div className="contact-thumbnail pull-left">
				    <img alt="image" src={"img/"+contact.thumb} />
				 </div>
			    <div className={"texture-overlay texture-"+textureNum+" business-card-radius-style-"+radiusStyle+" texture-overlay-bordered-"+borderStyle}></div>
			    <div className={"color-overlay-"+colorOverlayStyle+" business-card-radius-style-"+radiusStyle+" color-"+colorOverlayCol}></div>
				 <div className="contact-info">
				 	<div>
						<h2>{contact.name}</h2>
						<b>Email</b> {contact.email}<br/>
						<b>Phone</b> {contact.phone}<br/>
						<div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}>
						</div>
						{services}
					</div>
			    </div>
			</div>
		)
	}

});