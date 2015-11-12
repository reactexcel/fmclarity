
UserProfile = React.createClass({

	save() {
		var user = this.props.item;
		return function() {
			user.save();
		}
	},

	getForm() {
		return [
			{
				key:"firstName",
				type:"text"
			},
			{
				key:"lastName",
				type:"text"
			},
			{
				key:"name",
				type:"text"
			},
			{
				key:"email",
				type:"text"
			},
			{
				key:"phone",
				type:"text"
			},
			{
				key:"dob",
				type:"date"
			}
		]
	},

	render() {
		var user, profile, schema;
		var user = this.props.item;
		if(user) {
			profile = user.getProfile();
			schema = Schema.UserProfile;
		}
		if(!user||!profile) {
			return <div/>
		}
		return (
		    <div className="user-profile-card" style={{backgroundColor:"#fff"}}>
			    <div className="row">
			        <div className="col-lg-12">
		            	<h2 className="background"><span>{profile.name}</span></h2>
		            </div>
			   	</div>
			   	<div className="row">
			        <div className="col-lg-7">
			        	<AutoForm item={profile} schema={schema} form={this.getForm()} save={this.save()} />
			        </div>
			        <div className="col-lg-5">
						<div className="contact-thumbnail">
							<img style={{width:"100%"}} alt="image" src={"img/"+profile.thumb}/>
						</div>
					</div>
				</div>
				<div className="row">
			        <div className="col-lg-12">
		            	<h4 className="background"><span>About Me</span></h4>
		            	<textarea className="inline-form-control" defaultValue={user.bio} onChange={this.save()}></textarea>
		            </div>
				</div>
				<div className="row">
			        <div className="col-lg-12">
		            	<h4 className="background"><span>Change Password</span></h4>
		            	<dl className="dl-horizontal">
		            		<dt>Old password</dt>
		            		<dd><input type="password" className="inline-form-control"/></dd>
		            		<dt>New password</dt>
		            		<dd><input type="password" className="inline-form-control"/></dd>
		            		<dt>Confirm new password</dt>
		            		<dd><input type="password" className="inline-form-control"/></dd>
		            	</dl>
		            </div>
				</div>
			</div>
		)
	}
});

UserProfileWidget= React.createClass({
	getInitialState() {
		return {
			edit:false
		}
	},

	toggleEdit() {
		this.refs.card.classList.toggle("flip");
	},

	render() {
		var user = this.props.item;
		return (
			<div ref="card" className="flip-container">
				<div className="flipper">
					<div className="front">
			            <div className="ibox" style={{backgroundColor:"#fff",padding:"10px"}}>
							<ContactSummary item={user}/>
							<a onClick={this.toggleEdit} style={{
								position:"absolute",
								right:"5px",
								top:0,
								fontSize:"15px",
								color:"#ddd"
							}} onClick={this.toggleEdit}>
								<i className="fa fa-cog"></i> Edit
							</a>
			            </div>
		            </div>
					<div className="back">
			            <div className="ibox" style={{backgroundColor:"#eee",padding:"20px"}}>
							<UserProfile item={user}/>
							<a onClick={this.toggleEdit} style={{
								position:"absolute",
								right:"5px",
								top:0,
								fontSize:"15px",
								color:"#ddd"
							}} onClick={this.toggleEdit}>
								<i className="fa fa-eye"></i> View
							</a>
			            </div>
		            </div>
	            </div>
            </div>
		)
	}
});

UserProfilePage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
		return {
			user:Meteor.user()
		}
	},

	render() {
		return (
		    <div className="wrapper wrapper-content animated fadeIn">
		        <div className="row">
		            <div className="col-lg-6 col-md-6 col-sm-6">
		            	<UserProfileWidget item={this.data.user} />
					</div>
				</div>
			</div>
		)
	}
})