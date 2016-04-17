ContactSummary = React.createClass({
	render() {
		var contact, profile, availableServices;
	    contact = this.props.item;
	    if(!contact) {
	    	return <div/>
	    }
	    if(contact.getProfile) {
	    	profile = contact.getProfile();
	    }
	    if(contact.getAvailableServices) {
	    	availableServices = contact.getAvailableServices();	    	
	    }
	    
	    return (
	    	<div className="business-card">				
				<div className="contact-thumbnail pull-left">
				    <img alt="image" src={contact.getThumbUrl()} />
				 </div>
				 <div className="contact-info">
				 	<div>
						<h2>{contact.getName()}</h2>
						{profile.email?<span><b>Email</b> {profile.email}<br/></span>:null}
						{profile.phone||profile.phone2?<span><b>Phone</b> {profile.phone}<br/></span>:null}
						{profile.phone2?<span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {profile.phone2}<br/></span>:null}
						<div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}>
						</div>
						{availableServices?
						availableServices.map(function(service,index){
							return <span key={service.name}>{index?' | ':''}{service.name}</span>
						})
						:null}

					</div>
			    </div>
			</div>
		)
	}

});