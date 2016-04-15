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

	mixins:[ReactMeteorData],

	getMeteorData() {
		Meteor.subscribe('File');
		var contact, profile, name, url, style = {}, initials='';
		var colours = [
			"#000",
			"#f00",
			"#0f0",
			"#00f",
			"#ff0",
			"#0ff",
		];
		var placeholderStyle = {
			backgroundColor:"#000",
			color:"#fff",
			textAlign:"center",
			fontWeight:"bold",
			fontSize:"15px",
			paddingTop:"7px"
		};
		contact = this.props.item;
		if(contact) {
			profile = contact.getProfile();
		}
		name = profile?profile.name:"";
		url = contact?contact.getThumbUrl():"";
		if(url!="img/default-placeholder.jpg") {
			style['backgroundImage'] = 'url(\''+url+'\')';
			style['backgroundSize'] = "cover";
			style['color'] = "transparent";
		}
		else {
			var names = name.split(' ');
			if(names.length==2) {
				initials = names[0][0]+names[1][0];
			}
			else if(names.length==3) {
				initials = names[0][0]+names[1][0]+names[2][0];
			}
			else {
				initials = names[0][0]+names[0][1]+names[0][2]
			}
			var r = (name.charCodeAt(name.length-3)%25)*10;
			var g = (name.charCodeAt(name.length-2)%25)*10;
			var b = (name.charCodeAt(name.length-1)%25)*10;
			style=placeholderStyle;
			style['backgroundColor'] = 'rgb('+r+','+g+','+b+')';
		}
		return {
			name:name,
			initials:initials,
			style:style
		}
	},

	render() {
		return (
			<div className="contact-card-avatar">
				<div title={this.data.name} style={this.data.style}>{this.data.initials}</div>
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
		            	<i className="fa fa-phone"></i>&nbsp;&nbsp;
		            	{profile.phone}
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
		        	{profile.name} {profile.role?<span className="label label-default pull-right">{profile.role}</span>:null}<br/>
		        	<span style={{fontSize:"11px",color:"#777"}}>
		            	<i className="fa fa-envelope"></i>&nbsp;&nbsp;
		            	{profile.email}&nbsp;&nbsp;
		            	<i className="fa fa-phone"></i>&nbsp;&nbsp;
		            	{profile.phone}
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
			profile = contact.getProfile?contact.getProfile():contact;
		}
		if(!profile) {
			return <div />
		}
		return (
            <span className="contact-card contact-card-1line">
              <a href="#">{profile.name}</a>&nbsp;&nbsp;
              <span className="hidden-xs">
              <i className="fa fa-envelope"></i>&nbsp;&nbsp;
              {profile.email}&nbsp;&nbsp;
              <i className="fa fa-phone"></i>&nbsp;&nbsp;
              {profile.phone}
              </span>
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
		var role;
		if(this.props.team) {
			role = RBAC.getRole(contact,this.props.team);
			profile.role = role;
		}
		view = this.props.view;
		switch(view) {
			case 'avatar':return (
				<ContactAvatarSmall item={contact}/>
			);
			case '1-line':return (
				<Contact1Line item={contact}/>
			);
			default:return (
				<Contact2LineWithAvatar item={contact}/>
	        );
		}
	}
});