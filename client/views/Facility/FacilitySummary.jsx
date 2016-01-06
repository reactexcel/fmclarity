FacilitySummary = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
		var facility,contact,contactProfile;
	    facility = this.props.item || {};
	    if(facility) {
		    contact = facility.getPrimaryContact();
		    if(contact) {
		    	contactProfile = contact.getProfile();
		    }
		}
		return {
			facility:facility,
			contact:contactProfile
		}
    },

	render() {
		var facility = this.data.facility;
		var contact = this.data.contact;
	    return (
	    	<div>
	    		{/*
				<div style={{marginTop:"10px",width:"25px",float:"left"}}>
					<input type="checkbox" />
				</div>*/}
				<div className="facility-thumbnail pull-left">
				    <img style={{width:"40px"}} alt="image" src={facility.getThumbUrl()} />
				 </div>
				 <div className="facility-info">
					<span>
						{facility.getName()}
					</span>
					<br/>
					{contact?
					<span style={{fontSize:"11px",color:"#777"}}>
						<b style={{color:"#000"}}>Contact </b>
						{contact.name}&nbsp;&nbsp;
						<i className="fa fa-envelope"></i>&nbsp;&nbsp;
						{contact.email}&nbsp;&nbsp;
						<i className="fa fa-phone"></i>&nbsp;&nbsp;
						{contact.phone}
					</span>
					:null}
			    </div>
			</div>
		)
	}

});