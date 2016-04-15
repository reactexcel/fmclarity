TeamViewDetail = React.createClass({
	render() {
		var team, contact, contactName, profile, availableServices;
	    team = this.props.item;
	    if(!team) {
	    	return <div/>
	    }
	    if(team.getProfile) {
	    	profile = team.getProfile();
	    }
	    if(team.getAvailableServices) {
	    	availableServices = team.getAvailableServices();	    	
	    }
	    var members = team.getMembers();
	    if(members&&members.length) {
	    	contact = members[0];
	    }
	    if(contact) {
	    	contactName = contact.getName();
	    }
	    
	    return (
	    	<div className="business-card">				
				<div className="contact-thumbnail pull-left">
				    <img alt="image" src={team.getThumbUrl()} />
				 </div>
				 <div className="contact-info">
				 	<div>
						<h2>{team.getName()}</h2>
						<i style={{color:"#999",display:"block",padding:"3px"}}>{contactName?contactName:null}<br/></i>
						<b>Email</b> {team.email}<br/>
						{profile.phone?<span><b>Phone</b> {team.phone}<br/></span>:null}
						{team.phone2?<span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {profile.phone2}<br/></span>:null}
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