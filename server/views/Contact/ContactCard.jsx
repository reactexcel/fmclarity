ContactViewName = React.createClass({
	render() {
		var contact = this.props.item || {};
		var name = contact.getName?contact.getName():contact.name;
		return (
			<span>{name}</span>
		)
	}
})

ContactAvatarSmall = React.createClass({
	render() {
		var contact, profile;
		contact = this.props.item;
		if(contact) {
			profile = contact.getProfile();
		}
		return (
			<div className="contact-card-avatar">
			{profile?
				<img alt="image" title={profile.name} data-toggle="tooltip" src={contact.getThumbUrl()}/>
			:
				<div style={{width:"35px",height:"35px",border:"1px solid #ddd",borderRadius:"50%",backgroundColor:"#eee"}}/>
			}
			</div>
		)
	}

});

Contact2Line = React.createClass({
	render() {
		var contact, profile;
		contact = this.props.item;
		if(contact) {
			profile = contact.getProfile();
		}
		if(!profile) {
			return <div />
		}
		return (
			<div className="contact-card contact-card-2line">
				<div className="contact-card-2line-text">
		        	{profile.name}<br/>
		        	<span style={{fontSize:"11px",color:"#777"}}>
		            	<i className="fa fa-envelope"></i>&nbsp;&nbsp;
		            	{profile.email}&nbsp;&nbsp;
		            	{profile.phone?<span><i className="fa fa-phone"></i>&nbsp;&nbsp;{profile.phone}</span>:null}
		            </span>
		       	</div>
	        </div>
		)
	}
});

Contact2LineWithAvatar = React.createClass({
	render() {
		var contact, profile;
		contact = this.props.item;
		if(contact) {
			profile = contact.getProfile();
		}
		if(!profile) {
			return <div />
		}
		return (
			<div className="contact-card contact-card-2line">
				<span>
					<ContactAvatarSmall item={contact} />
				</span>
				<span className="contact-card-2line-text">
		        	{profile.name}<br/>
		        	<span style={{fontSize:"11px",color:"#777"}}>
		            	<i className="fa fa-envelope"></i>&nbsp;&nbsp;
		            	{profile.email}&nbsp;&nbsp;
		            	{profile.phone&&profile.phone.length?<span><i className="fa fa-phone"></i>&nbsp;&nbsp;{profile.phone}</span>:null}
		            </span>
		       	</span>
	        </div>
		)
	}
});

Contact1Line = React.createClass({
	render() {
		var contact, profile;
		contact = this.props.item;
		if(contact) {
			profile = contact.getProfile();
		}
		if(!profile) {
			return <div />
		}
		return (
            <span className="contact-card contact-card-1line">
              {profile.name}&nbsp;&nbsp;
              <i className="fa fa-envelope"></i>&nbsp;&nbsp;
              {profile.email}&nbsp;&nbsp;
              <i className="fa fa-phone"></i>&nbsp;&nbsp;
              {profile.phone}
            </span>
		)
	}
});

Contact3Line = React.createClass({
	render() {
		var contact, profile;
		contact = this.props.item;
		if(contact) {
			profile = contact.getProfile();
		}
		if(!profile) {
			return <div />
		}
		return (
            <div className="contact-card contact-card-1line">
              <div style={{color:"#000"}}>{profile.name}</div>
              <div style={{color:"#777"}}><i className="fa fa-envelope"></i>&nbsp;&nbsp;{profile.email}<br/>
              <i className="fa fa-phone"></i>&nbsp;&nbsp;{profile.phone}</div>
            </div>
		)
	}
});

ContactCard = React.createClass({
	render() {
		var contact,profile,view;
		contact = this.props.item;
		if(contact&&contact.getProfile) {
			profile = contact.getProfile();
		}
		else {
			console.log({
				'no getProfile function for':contact
			});
			profile = {};
		}
		view = this.props.view;
		switch(view) {
			case 'avatar':return (
				<ContactAvatarSmall item={contact} />
			);
			case '1-line':return (
				<Contact1Line item={contact} />
			);
			default:return (
				<Contact2LineWithAvatar item={contact} />
	        );
		}
	}
});