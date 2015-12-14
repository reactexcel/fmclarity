ContactSummary = React.createClass({

	random() {
	    var x = Math.sin(this.seed++) * 10000;
	    return x - Math.floor(x);
	},

	render() {
		var contact, profile;
	    contact = this.props.item;
	    if(!contact) {
	    	return <div/>
	    }
	    if(contact.getProfile) {
	    	profile = contact.getProfile();
	    }
	    if(profile.name) {
			this.seed = profile.name.charCodeAt(0)+profile.name.charCodeAt(1)+profile.name.charCodeAt(2);
		}
		else {
			this.seed = 1;
		}
	    var cardStyle = Math.ceil(this.random()*3);
	    var size=this.props.size;
	    var services = profile&&profile.services?profile.services.join(' | '):'';
	    return (
	    	<div className={"business-card"+" business-card-style-"+cardStyle+" "+size}>
	    		
				
	    		{/*
				<div style={{marginTop:"10px",width:"25px",float:"left"}}>
					<input type="checkbox" />
				</div>*/}
				<div className="contact-thumbnail pull-left">
				    <img alt="image" src={contact.getThumbUrl()} />
				 </div>
				 <div className="contact-info">
				 	<div>
						<h2>{contact.getName()}</h2>
						<b>Email</b> {profile.email}<br/>
						<b>Phone</b> {profile.phone}<br/>
						<div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}>
						</div>
						{services}
					</div>
			    </div>
			</div>
		)
	}

});