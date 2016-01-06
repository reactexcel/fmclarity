
UserProfile = React.createClass({

    mixins: [BaseProfilePageMixin],

	save() {
		Meteor.call('User.save',this.state.item);
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

	handleInvite(event) {
    	event.preventDefault();
    	var team,input,email,regex,component;
    	component = this;
		team = this.data.selectedTeam;
    	input = this.refs.invitationEmail;
    	email = input.value;
    	regex = /.+@.+\..+/i
    	if(!regex.test(email)) {
    		alert('Please enter a valid email address');
    	}
    	else {
            input.value = '';
            team.inviteMember(email, function(err,user){
            	component.setItem(user);
            	if(component.props.onChange) {
            		component.props.onChange(user);
            	}
            });
	    }
    },

    handleThumbChange(newThumb) {
		var user, profile;
		user = this.state.item;
		if(user) {
			profile = user.profile;
		}
		profile.thumb = newThumb;
		this.save();
    },

	render() {
		var user, profile, team;
		user = this.state.item;
		team = this.data.selectedTeam;
		if(user) {
			profile = user.profile;
		}
		if(!user||!profile||!team) {
			return (
                <form className="form-inline">
                    <div className="form-group">
                        <b>Type email address to invite user:</b>
                        <h2><input type="email" className="inline-form-control" ref="invitationEmail" placeholder="Email address"/></h2>
                        <button type="submit" style={{width:0,opacity:0}} onClick={this.handleInvite}>Invite</button>
                    </div>
                </form>
            )
		}
		return (
		    <div className="ibox-form user-profile-card">
		    	<div className="row">
		    		<div className="col-sm-12">
		           		<h2><span>{profile.name}</span></h2>
				   		<div onClick={team.removeMember.bind(team,user)}>
				   			Remove from team: <b>{team.getName()}</b>
				   		</div>
				   	</div>
				    <div className="col-sm-7">
			        	<AutoForm item={profile} schema={this.form1} save={this.save} />
			        </div>
			   		<div className="col-sm-5">
				        <AutoInput.File item={profile.thumb} onChange={this.handleThumbChange} />
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
		            <div className="col-lg-6">
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