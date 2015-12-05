
UserProfile = React.createClass({

	save() {
		var user = this.props.item;
		return function() {
			user.save();
		}
	},

	form1 : {
		firstName:{
			label:"First name",
			size:6
		},
		lastName:{
			label:"Last name",
			size:6
		},
		name:{
			label:"Display name",
		},
		email:{
			label:"Email address",
		},
		phone:{
			label:"Phone number",
		}
	},

	form2 : {
		bio:{
			label:"About me",
			input:"textarea"
		}
	},

	render() {
		var user, profile, schema;
		var user = this.props.item;
		if(user) {
			profile = user.getProfile();
			//schema = Schema.UserProfile;
		}
		if(!user||!profile) {
			return <div/>
		}
		return (
		    <div className="user-profile-card">
			    <div className="row">
			        <div className="col-lg-12">
		            	<h2 className="background"><span>{profile.name}</span></h2>
		            </div>
			   	</div>
			   	<div className="row">
			        <div className="col-lg-7" style={{paddingTop:"20px"}}>
			        	<AutoForm item={profile} schema={this.form1} save={this.save()} />
			        </div>
			        <div className="col-lg-5">
						<div className="contact-thumbnail">
							<img style={{width:"100%"}} alt="image" src={profile.thumb}/>
						</div>
					</div>
			        <div className="col-lg-12">
			        	<AutoForm item={profile} schema={this.form2} save={this.save()} />
			        </div>
				</div>
			</div>
		)
	}
});


UserProfileWidget= React.createClass({
	render() {
		return (
			<FlipWidget
				front={ContactSummary}
				back={UserProfile}
				item={this.props.item}
			/>
		)
	}
});

UserProfileModal = React.createClass({
	render() {
		return(
			<UserProfile item={this.props.item} /> 
		);
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
						<FlipWidget
							front={UserProfile}
							back={ContactSummary}
							item={this.data.user}
						/>
					</div>
				</div>
			</div>
		)
	}
})