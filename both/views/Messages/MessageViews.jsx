Message = React.createClass({

	mixins: [ReactMeteorData],

	getMeteorData() {
		var message, creator, profile;
		message = this.props.item;
		if(message) {
			creator = message.getCreator();
		}
		profile = creator?creator.getProfile():{};
		return {
			message:message,
			creator:creator,
			profile:profile
		}		
	},

	render() {
		var message = this.data.message;
		var creator = this.data.creator;
		var profile = this.data.profile;
		return (
			<div className="contact-card contact-card-2line">
				<div className="row" style={{margin:0}}>
					<div className="col-lg-1">
						<ContactAvatarSmall item={creator} />
					</div>
					<div className="col-lg-11">
						<div style={{float:"right",position:"relative",top:"-5px"}}>
							<AutoInput.rating />
						</div>
						<div style={{color:"#333",fontWeight:"bold"}}>
				        	{profile.name}&nbsp;&nbsp;&bull;&nbsp;&nbsp;{moment(message.createdAt).fromNow()}
				       	</div>
				    	<div style={{float:"left"}}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</div>
				    </div>
			    </div>
			    <hr/>
	        </div>
		)
	}
});