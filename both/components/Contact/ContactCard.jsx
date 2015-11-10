ContactViewName = React.createClass({
	render() {
		var contact = this.props.item || {};
		return (
			<span>{contact.name}</span>
		)
	}
})

ContactCard = React.createClass({
	render() {
		var contact = this.props.item || {};
		var profile = contact.profile || {phone:{}};
		var view = this.props.view;
		switch(view) {
			case 'avatar':return (
				<div className="contact-card-avatar">
					<img alt="image" title={profile.name} data-toggle="tooltip" src={"img/"+profile.thumb}/>
				</div>
			);
			case '2-line':return (
				<div className="contact-card contact-card-2line">
					<div className="contact-card-avatar">
						<img alt="image" src={"img/"+profile.thumb}/>
					</div>
					<div className="contact-card-2line-text">
			            {profile.name}<br/>
			            <i className="fa fa-envelope"></i>&nbsp;&nbsp;{profile.email}
			       	</div>
	           	</div>
			);
			default:return (
	            <small className="contact-card contact-card-1line">
	              {profile.name}&nbsp;&nbsp;
	              <i className="fa fa-envelope"></i>&nbsp;&nbsp;
	              {contact.emails[0].address}&nbsp;&nbsp;
	              <i className="fa fa-phone"></i>&nbsp;&nbsp;
	              {profile.phone.mobile}
	            </small>
	        );
		}
	}
})